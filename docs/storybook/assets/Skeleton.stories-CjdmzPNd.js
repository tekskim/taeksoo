import{r as m,j as e}from"./iframe-WEp3SeCx.js";import{t as p}from"./bundle-mjs-BZSatpsL.js";import"./preload-helper-C1FmrZbK.js";const t=m.forwardRef(({variant:a="text",width:s,height:l,animation:r="pulse",count:i=1,gap:u=8,loading:o=!0,children:R,size:d,className:_="",style:je,...L},C)=>{if(!o&&R)return e.jsx(e.Fragment,{children:R});const I=["bg-[var(--color-surface-muted)]",r==="pulse"&&"animate-pulse",r==="wave"&&"animate-shimmer"].filter(Boolean).join(" "),M={text:"rounded-[var(--radius-sm)]",circular:"rounded-full",rectangular:"rounded-none",rounded:"rounded-[var(--radius-md)]"},we=()=>{if(s)return typeof s=="number"?`${s}px`:s;if(a==="circular"&&d)return`${d}px`;if(a==="text")return"100%"},Se=()=>{if(l)return typeof l=="number"?`${l}px`:l;if(a==="circular"&&d)return`${d}px`;if(a==="text")return"1em"},q={width:we(),height:Se(),...je};return i>1?e.jsx("div",{ref:C,className:p("flex flex-col",_),style:{gap:u},...L,children:Array.from({length:i}).map((ke,P)=>e.jsx("div",{className:p(I,M[a]),style:{...q,width:a==="text"&&P===i-1?"80%":q.width}},P))}):e.jsx("div",{ref:C,className:p(I,M[a],_),style:q,...L})});t.displayName="Skeleton";const A=m.forwardRef(({lines:a=3,...s},l)=>e.jsx(t,{ref:l,variant:"text",count:a,height:16,...s}));A.displayName="SkeletonText";const ye={sm:32,md:40,lg:56},n=m.forwardRef(({size:a="md",...s},l)=>{const r=typeof a=="number"?a:ye[a];return e.jsx(t,{ref:l,variant:"circular",size:r,...s})});n.displayName="SkeletonAvatar";const B={sm:{width:64,height:28},md:{width:80,height:32},lg:{width:96,height:40}},c=m.forwardRef(({size:a="md",...s},l)=>e.jsx(t,{ref:l,variant:"rounded",width:B[a].width,height:B[a].height,...s}));c.displayName="SkeletonButton";const x=m.forwardRef(({aspectRatio:a="16/9",width:s="100%",...l},r)=>e.jsx(t,{ref:r,variant:"rounded",width:s,style:{aspectRatio:a},...l}));x.displayName="SkeletonImage";const h=m.forwardRef(({avatar:a=!0,lines:s=3,image:l=!1,className:r="",...i},u)=>e.jsxs("div",{ref:u,className:p("flex flex-col gap-4 p-4","bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","rounded-[var(--radius-lg)]",r),...i,children:[l&&e.jsx(x,{}),a&&e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{size:"md"}),e.jsxs("div",{className:"flex-1 flex flex-col gap-2",children:[e.jsx(t,{variant:"text",width:"60%",height:16}),e.jsx(t,{variant:"text",width:"40%",height:12})]})]}),e.jsx(A,{lines:s})]}));h.displayName="SkeletonCard";const V=m.forwardRef(({rows:a=5,columns:s=4,className:l="",...r},i)=>e.jsxs("div",{ref:i,className:p("flex flex-col gap-2",l),...r,children:[e.jsx("div",{className:"flex gap-4 py-2 border-b border-[var(--color-border-default)]",children:Array.from({length:s}).map((u,o)=>e.jsx(t,{variant:"text",width:o===0?"20%":`${60/(s-1)}%`,height:14},`header-${o}`))}),Array.from({length:a}).map((u,o)=>e.jsx("div",{className:"flex gap-4 py-3 border-b border-[var(--color-border-subtle)]",children:Array.from({length:s}).map((R,d)=>e.jsx(t,{variant:"text",width:d===0?"20%":`${60/(s-1)}%`,height:16},`cell-${o}-${d}`))},`row-${o}`))]}));V.displayName="SkeletonTable";t.__docgenInfo={description:"",methods:[],displayName:"Skeleton",props:{variant:{required:!1,tsType:{name:"union",raw:"'text' | 'circular' | 'rectangular' | 'rounded'",elements:[{name:"literal",value:"'text'"},{name:"literal",value:"'circular'"},{name:"literal",value:"'rectangular'"},{name:"literal",value:"'rounded'"}]},description:"Skeleton variant",defaultValue:{value:"'text'",computed:!1}},width:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"Width (CSS value or number for px)"},height:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"Height (CSS value or number for px)"},animation:{required:!1,tsType:{name:"union",raw:"'pulse' | 'wave' | 'none'",elements:[{name:"literal",value:"'pulse'"},{name:"literal",value:"'wave'"},{name:"literal",value:"'none'"}]},description:"Animation type",defaultValue:{value:"'pulse'",computed:!1}},count:{required:!1,tsType:{name:"number"},description:"Number of skeleton rows (for text variant)",defaultValue:{value:"1",computed:!1}},gap:{required:!1,tsType:{name:"number"},description:"Gap between rows (for count > 1)",defaultValue:{value:"8",computed:!1}},loading:{required:!1,tsType:{name:"boolean"},description:"Whether to show the skeleton",defaultValue:{value:"true",computed:!1}},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Children to show when not loading"},size:{required:!1,tsType:{name:"number"},description:"Circle size (for circular variant)"},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};A.__docgenInfo={description:"",methods:[],displayName:"SkeletonText",props:{lines:{required:!1,tsType:{name:"number"},description:"Number of lines",defaultValue:{value:"3",computed:!1}}},composes:["Omit"]};n.__docgenInfo={description:"",methods:[],displayName:"SkeletonAvatar",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg' | number",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"number"}]},description:"Avatar size",defaultValue:{value:"'md'",computed:!1}}},composes:["Omit"]};c.__docgenInfo={description:"",methods:[],displayName:"SkeletonButton",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Button size",defaultValue:{value:"'md'",computed:!1}}},composes:["Omit"]};x.__docgenInfo={description:"",methods:[],displayName:"SkeletonImage",props:{aspectRatio:{required:!1,tsType:{name:"string"},description:'Aspect ratio (e.g., "16/9", "4/3", "1/1")',defaultValue:{value:"'16/9'",computed:!1}},width:{defaultValue:{value:"'100%'",computed:!1},required:!1}},composes:["Omit"]};h.__docgenInfo={description:"",methods:[],displayName:"SkeletonCard",props:{avatar:{required:!1,tsType:{name:"boolean"},description:"Show avatar",defaultValue:{value:"true",computed:!1}},lines:{required:!1,tsType:{name:"number"},description:"Number of text lines",defaultValue:{value:"3",computed:!1}},image:{required:!1,tsType:{name:"boolean"},description:"Show image placeholder",defaultValue:{value:"false",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};V.__docgenInfo={description:"",methods:[],displayName:"SkeletonTable",props:{rows:{required:!1,tsType:{name:"number"},description:"Number of rows",defaultValue:{value:"5",computed:!1}},columns:{required:!1,tsType:{name:"number"},description:"Number of columns",defaultValue:{value:"4",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};const Re={title:"Components/Skeleton",component:t,parameters:{layout:"padded"},argTypes:{variant:{control:"select",options:["text","circular","rectangular","rounded"]},animation:{control:"select",options:["pulse","wave","none"]},width:{control:"text"},height:{control:"text"}}},v={args:{width:200,height:20}},f={render:()=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Text"}),e.jsx(t,{variant:"text",width:200,height:16})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Circular"}),e.jsx(t,{variant:"circular",size:48})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Rectangular"}),e.jsx(t,{variant:"rectangular",width:200,height:100})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Rounded"}),e.jsx(t,{variant:"rounded",width:200,height:100})]})]})},g={render:()=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Pulse (default)"}),e.jsx(t,{animation:"pulse",width:200,height:20})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Wave"}),e.jsx(t,{animation:"wave",width:200,height:20})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"None"}),e.jsx(t,{animation:"none",width:200,height:20})]})]})},b={render:()=>e.jsx("div",{className:"w-[300px]",children:e.jsx(t,{variant:"text",count:4,height:16,gap:8})})},N={render:()=>e.jsxs("div",{className:"w-[300px]",children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-4",children:"SkeletonText"}),e.jsx(A,{lines:4})]})},j={render:()=>e.jsxs("div",{className:"flex gap-4 items-center",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(n,{size:"sm"}),e.jsx("span",{className:"text-body-sm",children:"SM"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(n,{size:"md"}),e.jsx("span",{className:"text-body-sm",children:"MD"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(n,{size:"lg"}),e.jsx("span",{className:"text-body-sm",children:"LG"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(n,{size:64}),e.jsx("span",{className:"text-body-sm",children:"64px"})]})]})},w={render:()=>e.jsxs("div",{className:"flex gap-4 items-center",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(c,{size:"sm"}),e.jsx("span",{className:"text-body-sm",children:"SM"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(c,{size:"md"}),e.jsx("span",{className:"text-body-sm",children:"MD"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(c,{size:"lg"}),e.jsx("span",{className:"text-body-sm",children:"LG"})]})]})},S={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("div",{className:"w-[200px]",children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"16:9"}),e.jsx(x,{aspectRatio:"16/9"})]}),e.jsxs("div",{className:"w-[150px]",children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"4:3"}),e.jsx(x,{aspectRatio:"4/3"})]}),e.jsxs("div",{className:"w-[100px]",children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"1:1"}),e.jsx(x,{aspectRatio:"1/1"})]})]})},y={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("div",{className:"w-[300px]",children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"With Avatar"}),e.jsx(h,{avatar:!0,lines:3})]}),e.jsxs("div",{className:"w-[300px]",children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"With Image"}),e.jsx(h,{avatar:!0,image:!0,lines:2})]}),e.jsxs("div",{className:"w-[300px]",children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Text Only"}),e.jsx(h,{avatar:!1,lines:4})]})]})},k={render:()=>e.jsxs("div",{className:"w-full max-w-[600px]",children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-4",children:"SkeletonTable"}),e.jsx(V,{rows:5,columns:4})]})},T={render:()=>{const s={name:"John Doe",email:"john@example.com"};return e.jsxs("div",{className:"flex flex-col gap-4 w-[300px]",children:[e.jsxs("h3",{className:"text-label-sm text-[var(--color-text-subtle)]",children:["With loading prop (loading=",String(!0),")"]}),e.jsx(t,{loading:!0,variant:"text",width:"100%",height:20,children:e.jsx("span",{children:s.name})}),e.jsx(t,{loading:!0,variant:"text",width:"80%",height:16,children:e.jsx("span",{children:s.email})})]})}},z={render:()=>e.jsxs("div",{className:"flex gap-4 p-4 border border-[var(--color-border-default)] rounded-lg w-[400px]",children:[e.jsx(n,{size:"lg"}),e.jsxs("div",{className:"flex-1 flex flex-col gap-2",children:[e.jsx(t,{variant:"text",width:"70%",height:18}),e.jsx(t,{variant:"text",width:"50%",height:14}),e.jsxs("div",{className:"flex gap-2 mt-2",children:[e.jsx(c,{size:"sm"}),e.jsx(c,{size:"sm"})]})]})]})};var W,$,D;v.parameters={...v.parameters,docs:{...(W=v.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    width: 200,
    height: 20
  }
}`,...(D=($=v.parameters)==null?void 0:$.docs)==null?void 0:D.source}}};var O,E,G;f.parameters={...f.parameters,docs:{...(O=f.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Text</h3>
        <Skeleton variant="text" width={200} height={16} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Circular</h3>
        <Skeleton variant="circular" size={48} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Rectangular</h3>
        <Skeleton variant="rectangular" width={200} height={100} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Rounded</h3>
        <Skeleton variant="rounded" width={200} height={100} />
      </div>
    </div>
}`,...(G=(E=f.parameters)==null?void 0:E.docs)==null?void 0:G.source}}};var H,J,F;g.parameters={...g.parameters,docs:{...(H=g.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Pulse (default)</h3>
        <Skeleton animation="pulse" width={200} height={20} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Wave</h3>
        <Skeleton animation="wave" width={200} height={20} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">None</h3>
        <Skeleton animation="none" width={200} height={20} />
      </div>
    </div>
}`,...(F=(J=g.parameters)==null?void 0:J.docs)==null?void 0:F.source}}};var K,Q,U;b.parameters={...b.parameters,docs:{...(K=b.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <div className="w-[300px]">
      <Skeleton variant="text" count={4} height={16} gap={8} />
    </div>
}`,...(U=(Q=b.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var X,Y,Z;N.parameters={...N.parameters,docs:{...(X=N.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div className="w-[300px]">
      <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-4">SkeletonText</h3>
      <SkeletonText lines={4} />
    </div>
}`,...(Z=(Y=N.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,ae,te;j.parameters={...j.parameters,docs:{...(ee=j.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="sm" />
        <span className="text-body-sm">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="md" />
        <span className="text-body-sm">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="lg" />
        <span className="text-body-sm">LG</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size={64} />
        <span className="text-body-sm">64px</span>
      </div>
    </div>
}`,...(te=(ae=j.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};var se,le,re;w.parameters={...w.parameters,docs:{...(se=w.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="sm" />
        <span className="text-body-sm">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="md" />
        <span className="text-body-sm">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="lg" />
        <span className="text-body-sm">LG</span>
      </div>
    </div>
}`,...(re=(le=w.parameters)==null?void 0:le.docs)==null?void 0:re.source}}};var ne,ie,oe;S.parameters={...S.parameters,docs:{...(ne=S.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <div className="w-[200px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">16:9</h3>
        <SkeletonImage aspectRatio="16/9" />
      </div>
      <div className="w-[150px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">4:3</h3>
        <SkeletonImage aspectRatio="4/3" />
      </div>
      <div className="w-[100px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">1:1</h3>
        <SkeletonImage aspectRatio="1/1" />
      </div>
    </div>
}`,...(oe=(ie=S.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};var de,ce,me;y.parameters={...y.parameters,docs:{...(de=y.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <div className="w-[300px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">With Avatar</h3>
        <SkeletonCard avatar lines={3} />
      </div>
      <div className="w-[300px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">With Image</h3>
        <SkeletonCard avatar image lines={2} />
      </div>
      <div className="w-[300px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Text Only</h3>
        <SkeletonCard avatar={false} lines={4} />
      </div>
    </div>
}`,...(me=(ce=y.parameters)==null?void 0:ce.docs)==null?void 0:me.source}}};var xe,ue,pe;k.parameters={...k.parameters,docs:{...(xe=k.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-[600px]">
      <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-4">SkeletonTable</h3>
      <SkeletonTable rows={5} columns={4} />
    </div>
}`,...(pe=(ue=k.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var he,ve,fe;T.parameters={...T.parameters,docs:{...(he=T.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => {
    const isLoading = true;
    const data = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    return <div className="flex flex-col gap-4 w-[300px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)]">
          With loading prop (loading={String(isLoading)})
        </h3>
        <Skeleton loading={isLoading} variant="text" width="100%" height={20}>
          <span>{data.name}</span>
        </Skeleton>
        <Skeleton loading={isLoading} variant="text" width="80%" height={16}>
          <span>{data.email}</span>
        </Skeleton>
      </div>;
  }
}`,...(fe=(ve=T.parameters)==null?void 0:ve.docs)==null?void 0:fe.source}}};var ge,be,Ne;z.parameters={...z.parameters,docs:{...(ge=z.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 p-4 border border-[var(--color-border-default)] rounded-lg w-[400px]">
      <SkeletonAvatar size="lg" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton variant="text" width="70%" height={18} />
        <Skeleton variant="text" width="50%" height={14} />
        <div className="flex gap-2 mt-2">
          <SkeletonButton size="sm" />
          <SkeletonButton size="sm" />
        </div>
      </div>
    </div>
}`,...(Ne=(be=z.parameters)==null?void 0:be.docs)==null?void 0:Ne.source}}};const qe=["Default","Variants","Animations","MultipleLines","TextPreset","AvatarPreset","ButtonPreset","ImagePreset","CardPreset","TablePreset","LoadingState","CompositeExample"];export{g as Animations,j as AvatarPreset,w as ButtonPreset,y as CardPreset,z as CompositeExample,v as Default,S as ImagePreset,T as LoadingState,b as MultipleLines,k as TablePreset,N as TextPreset,f as Variants,qe as __namedExportsOrder,Re as default};
