import{r as i,j as e}from"./iframe-CiM_PzFy.js";import{I as je}from"./IconChevronLeft-CQ5RkGS0.js";import{I as Ie}from"./IconChevronRight-B66hzYCq.js";import{I as ke}from"./IconSettings-DKUoH92N.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Dtj5WpGl.js";const x=(n,t)=>{const a=t-n+1;return Array.from({length:a},(p,l)=>l+n)},h="dots",r=({currentPage:n,currentAt:t,totalPages:a,totalCount:p,size:l,onPageChange:P,siblingCount:u=1,disabled:g=!1,showSettings:de=!1,onSettingsClick:pe,totalItems:q,selectedCount:D=0,className:Pe=""})=>{const o=n??t??1,s=a??(p&&l?Math.ceil(p/l):0),fe=i.useMemo(()=>{if(u+5>=s)return x(1,s);const b=Math.max(o-u,1),c=Math.min(o+u,s),d=b>2,z=c<s-1,M=1,ye=s;if(!d&&z){const f=3+2*u;return[...x(1,f),h,s]}if(d&&!z){const f=3+2*u,R=x(s-f+1,s);return[M,h,...R]}if(d&&z){const f=x(b,c);return[M,h,...f,h,ye]}return[]},[s,u,o]),he=()=>{o>1&&!g&&P(o-1)},be=()=>{o<s&&!g&&P(o+1)},xe=m=>{!g&&m!==o&&P(m)};if(s<=0)return null;const F=`
    inline-flex items-center justify-center
    size-[var(--pagination-item-size)]
    text-[length:var(--pagination-font-size)]
    leading-[var(--pagination-line-height)]
    font-medium
    rounded-[var(--pagination-radius)]
    transition-colors duration-[var(--duration-fast)]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[var(--color-border-focus)]
  `,ve=`
    ${F}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    cursor-pointer
  `,Se=`
    ${F}
    bg-[var(--color-action-primary)]
    text-[var(--color-text-on-primary)]
  `,W=`
    ${F}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    disabled:text-[var(--color-text-disabled)]
    disabled:cursor-not-allowed
    disabled:hover:bg-transparent
  `,Ce=`
    inline-flex items-center justify-center
    size-[var(--pagination-item-size)]
    text-[length:var(--pagination-font-size)]
    text-[var(--pagination-text)]
  `;return e.jsxs("nav",{"aria-label":"Pagination",className:`inline-flex items-center gap-[var(--pagination-gap)] ${Pe}`,children:[e.jsx("button",{type:"button",onClick:he,disabled:g||o===1,className:W,"aria-label":"Previous page",children:e.jsx(je,{size:14,stroke:1})}),fe.map((m,b)=>{if(m===h)return e.jsx("span",{className:Ce,children:"···"},`dots-${b}`);const c=m,d=c===o;return e.jsx("button",{type:"button",onClick:()=>xe(c),disabled:g,className:d?Se:ve,"aria-label":`Page ${c}`,"aria-current":d?"page":void 0,children:c},c)}),e.jsx("button",{type:"button",onClick:be,disabled:g||o===s,className:W,"aria-label":"Next page",children:e.jsx(Ie,{size:14,stroke:1})}),de&&e.jsx("button",{type:"button",onClick:pe,disabled:g,className:W,"aria-label":"Pagination settings",children:e.jsx(ke,{size:16,stroke:1})}),q!==void 0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"h-4 w-px bg-[var(--color-border-default)]"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:D>0?e.jsxs("span",{children:[e.jsxs("span",{className:"text-[var(--color-text-default)] font-medium",children:[D," selected"]}),e.jsxs("span",{className:"text-[var(--color-text-muted)]",children:[" / ",q," items"]})]}):`${q} items`})]})]})};r.__docgenInfo={description:"",methods:[],displayName:"Pagination",props:{currentPage:{required:!1,tsType:{name:"number"},description:"Current active page (1-indexed)"},currentAt:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - use currentPage instead"},totalPages:{required:!1,tsType:{name:"number"},description:"Total number of pages (provide this OR totalCount+size)"},totalCount:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - use totalPages instead"},size:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - items per page, used with totalCount"},onPageChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(page: number) => void",signature:{arguments:[{type:{name:"number"},name:"page"}],return:{name:"void"}}},description:"Callback when page changes"},siblingCount:{required:!1,tsType:{name:"number"},description:"Number of sibling pages to show on each side of current page",defaultValue:{value:"1",computed:!1}},showFirstLast:{required:!1,tsType:{name:"boolean"},description:"Show first/last page buttons"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},showSettings:{required:!1,tsType:{name:"boolean"},description:"Show settings button",defaultValue:{value:"false",computed:!1}},onSettingsClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when settings button is clicked"},totalItems:{required:!1,tsType:{name:"number"},description:"Total number of items (displayed after divider)"},selectedCount:{required:!1,tsType:{name:"number"},description:"Number of selected items",defaultValue:{value:"0",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const ze={title:"Components/Pagination",component:r,tags:["autodocs"],parameters:{docs:{description:{component:`
## Pagination 컴포넌트

테이블이나 목록의 페이지 네비게이션을 제공하는 컴포넌트입니다.

### 기능
- 현재 페이지 표시
- 이전/다음 페이지 이동
- 페이지 번호 직접 선택
- 총 항목 수 표시
- 선택된 항목 수 표시
- 설정 버튼 (페이지당 항목 수 변경 등)

### 페이지 범위 표시
- siblingCount: 현재 페이지 양옆에 표시할 페이지 수
- 페이지가 많으면 "..." (ellipsis) 표시

### 예시
\`\`\`tsx
import { Pagination } from '@thaki/tds';

// 기본 사용
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setPage(page)}
/>

// 총 항목 수 표시
<Pagination
  currentPage={page}
  totalPages={Math.ceil(items.length / 10)}
  totalItems={items.length}
  onPageChange={setPage}
/>

// 선택 항목 수 & 설정 버튼
<Pagination
  currentPage={page}
  totalPages={10}
  totalItems={100}
  selectedCount={5}
  showSettings
  onSettingsClick={() => openSettings()}
  onPageChange={setPage}
/>
\`\`\`
        `}}},argTypes:{currentPage:{control:"number",description:"현재 페이지 (1부터 시작)",table:{type:{summary:"number"}}},totalPages:{control:"number",description:"전체 페이지 수",table:{type:{summary:"number"}}},totalItems:{control:"number",description:"전체 항목 수 (표시용)",table:{type:{summary:"number"}}},selectedCount:{control:"number",description:"선택된 항목 수",table:{type:{summary:"number"},defaultValue:{summary:"0"}}},siblingCount:{control:"number",description:"현재 페이지 양옆에 표시할 페이지 수",table:{type:{summary:"number"},defaultValue:{summary:"1"}}},disabled:{control:"boolean",description:"전체 비활성화",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},showSettings:{control:"boolean",description:"설정 버튼 표시",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},v={render:function(){const[t,a]=i.useState(1);return e.jsx(r,{currentPage:t,totalPages:10,onPageChange:a})}},S={render:function(){const[t,a]=i.useState(1);return e.jsx(r,{currentPage:t,totalPages:10,totalItems:100,onPageChange:a})}},C={render:function(){const[t,a]=i.useState(1);return e.jsx(r,{currentPage:t,totalPages:10,totalItems:100,selectedCount:5,onPageChange:a})}},y={render:function(){const[t,a]=i.useState(1);return e.jsx(r,{currentPage:t,totalPages:10,totalItems:100,showSettings:!0,onSettingsClick:()=>alert("Settings clicked!"),onPageChange:a})}},j={render:function(){const[t,a]=i.useState(25);return e.jsx(r,{currentPage:t,totalPages:100,totalItems:1e3,onPageChange:a})}},I={render:function(){const[t,a]=i.useState(1);return e.jsx(r,{currentPage:t,totalPages:3,totalItems:30,onPageChange:a})}},k={render:function(){const[t,a]=i.useState(1);return e.jsx(r,{currentPage:t,totalPages:10,onPageChange:a})}},N={render:function(){const[t,a]=i.useState(10);return e.jsx(r,{currentPage:t,totalPages:10,onPageChange:a})}},w={render:()=>e.jsx(r,{currentPage:5,totalPages:10,disabled:!0,onPageChange:()=>{}})},T={render:function(){const[t,a]=i.useState(5),[p,l]=i.useState(3);return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(r,{currentPage:t,totalPages:20,totalItems:200,selectedCount:p,showSettings:!0,onSettingsClick:()=>alert("Open settings"),onPageChange:a}),e.jsxs("div",{className:"flex gap-4 text-sm",children:[e.jsx("button",{className:"text-[var(--color-action-primary)]",onClick:()=>l(P=>P+1),children:"Select more"}),e.jsx("button",{className:"text-[var(--color-action-primary)]",onClick:()=>l(0),children:"Clear selection"})]})]})}};var V,E,L;v.parameters={...v.parameters,docs:{...(V=v.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: function DefaultPagination() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`,...(L=(E=v.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};var $,O,_;S.parameters={...S.parameters,docs:{...($=S.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: function WithTotalItems() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} totalItems={100} onPageChange={setPage} />;
  }
}`,...(_=(O=S.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var A,B,G;C.parameters={...C.parameters,docs:{...(A=C.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: function WithSelection() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} totalItems={100} selectedCount={5} onPageChange={setPage} />;
  }
}`,...(G=(B=C.parameters)==null?void 0:B.docs)==null?void 0:G.source}}};var H,J,K;y.parameters={...y.parameters,docs:{...(H=y.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: function WithSettings() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} totalItems={100} showSettings onSettingsClick={() => alert('Settings clicked!')} onPageChange={setPage} />;
  }
}`,...(K=(J=y.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,X;j.parameters={...j.parameters,docs:{...(Q=j.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: function ManyPages() {
    const [page, setPage] = useState(25);
    return <Pagination currentPage={page} totalPages={100} totalItems={1000} onPageChange={setPage} />;
  }
}`,...(X=(U=j.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,Z,ee;I.parameters={...I.parameters,docs:{...(Y=I.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: function FewPages() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={3} totalItems={30} onPageChange={setPage} />;
  }
}`,...(ee=(Z=I.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,ae,ne;k.parameters={...k.parameters,docs:{...(te=k.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: function FirstPage() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`,...(ne=(ae=k.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};var se,re,oe;N.parameters={...N.parameters,docs:{...(se=N.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: function LastPage() {
    const [page, setPage] = useState(10);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`,...(oe=(re=N.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};var ie,ce,le;w.parameters={...w.parameters,docs:{...(ie=w.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <Pagination currentPage={5} totalPages={10} disabled onPageChange={() => {}} />
}`,...(le=(ce=w.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var ge,ue,me;T.parameters={...T.parameters,docs:{...(ge=T.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: function FullExample() {
    const [page, setPage] = useState(5);
    const [selectedCount, setSelectedCount] = useState(3);
    return <div className="flex flex-col gap-4">
        <Pagination currentPage={page} totalPages={20} totalItems={200} selectedCount={selectedCount} showSettings onSettingsClick={() => alert('Open settings')} onPageChange={setPage} />
        <div className="flex gap-4 text-sm">
          <button className="text-[var(--color-action-primary)]" onClick={() => setSelectedCount(s => s + 1)}>
            Select more
          </button>
          <button className="text-[var(--color-action-primary)]" onClick={() => setSelectedCount(0)}>
            Clear selection
          </button>
        </div>
      </div>;
  }
}`,...(me=(ue=T.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};const De=["Default","WithTotalItems","WithSelection","WithSettings","ManyPages","FewPages","FirstPage","LastPage","Disabled","FullExample"];export{v as Default,w as Disabled,I as FewPages,k as FirstPage,T as FullExample,N as LastPage,j as ManyPages,C as WithSelection,y as WithSettings,S as WithTotalItems,De as __namedExportsOrder,ze as default};
