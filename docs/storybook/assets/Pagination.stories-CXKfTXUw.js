import{r as o,j as t}from"./iframe-DKmDJy9M.js";import{I as be}from"./IconChevronLeft-rXH75vem.js";import{I as ve}from"./IconChevronRight-Dymhorbf.js";import{I as Se}from"./IconSettings-WI1EblWW.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-DB1W9lnY.js";const p=(a,e)=>{const n=e-a+1;return Array.from({length:n},(i,s)=>s+a)},m="dots",r=({currentPage:a,totalPages:e,onPageChange:n,siblingCount:i=1,disabled:s=!1,showSettings:I=!1,onSettingsClick:le,totalItems:N,selectedCount:F=0,className:ge=""})=>{const ue=o.useMemo(()=>{if(i+5>=e)return p(1,e);const d=Math.max(a-i,1),c=Math.min(a+i,e),g=d>2,T=c<e-1,W=1,xe=e;if(!g&&T){const u=3+2*i;return[...p(1,u),m,e]}if(g&&!T){const u=3+2*i,q=p(e-u+1,e);return[W,m,...q]}if(g&&T){const u=p(d,c);return[W,m,...u,m,xe]}return[]},[e,i,a]),me=()=>{a>1&&!s&&n(a-1)},de=()=>{a<e&&!s&&n(a+1)},pe=l=>{!s&&l!==a&&n(l)};if(e<=0)return null;const k=`
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
  `,Pe=`
    ${k}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    cursor-pointer
  `,fe=`
    ${k}
    bg-[var(--color-action-primary)]
    text-[var(--color-text-on-primary)]
  `,w=`
    ${k}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    disabled:text-[var(--color-text-disabled)]
    disabled:cursor-not-allowed
    disabled:hover:bg-transparent
  `,he=`
    inline-flex items-center justify-center
    size-[var(--pagination-item-size)]
    text-[length:var(--pagination-font-size)]
    text-[var(--pagination-text)]
  `;return t.jsxs("nav",{"aria-label":"Pagination",className:`inline-flex items-center gap-[var(--pagination-gap)] ${ge}`,children:[t.jsx("button",{type:"button",onClick:me,disabled:s||a===1,className:w,"aria-label":"Previous page",children:t.jsx(be,{size:14,stroke:1})}),ue.map((l,d)=>{if(l===m)return t.jsx("span",{className:he,children:"···"},`dots-${d}`);const c=l,g=c===a;return t.jsx("button",{type:"button",onClick:()=>pe(c),disabled:s,className:g?fe:Pe,"aria-label":`Page ${c}`,"aria-current":g?"page":void 0,children:c},c)}),t.jsx("button",{type:"button",onClick:de,disabled:s||a===e,className:w,"aria-label":"Next page",children:t.jsx(ve,{size:14,stroke:1})}),I&&t.jsx("button",{type:"button",onClick:le,disabled:s,className:w,"aria-label":"Pagination settings",children:t.jsx(Se,{size:16,stroke:1})}),N!==void 0&&t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"h-4 w-px bg-[var(--color-border-default)]"}),t.jsx("span",{className:"text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]",children:F>0?t.jsxs("span",{children:[t.jsxs("span",{className:"text-[var(--color-text-default)] font-medium",children:[F," selected"]}),t.jsxs("span",{className:"text-[var(--color-text-muted)]",children:[" / ",N," items"]})]}):`${N} items`})]})]})};r.__docgenInfo={description:"",methods:[],displayName:"Pagination",props:{currentPage:{required:!0,tsType:{name:"number"},description:"Current active page (1-indexed)"},totalPages:{required:!0,tsType:{name:"number"},description:"Total number of pages"},onPageChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(page: number) => void",signature:{arguments:[{type:{name:"number"},name:"page"}],return:{name:"void"}}},description:"Callback when page changes"},siblingCount:{required:!1,tsType:{name:"number"},description:"Number of sibling pages to show on each side of current page",defaultValue:{value:"1",computed:!1}},showFirstLast:{required:!1,tsType:{name:"boolean"},description:"Show first/last page buttons"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},showSettings:{required:!1,tsType:{name:"boolean"},description:"Show settings button",defaultValue:{value:"false",computed:!1}},onSettingsClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when settings button is clicked"},totalItems:{required:!1,tsType:{name:"number"},description:"Total number of items (displayed after divider)"},selectedCount:{required:!1,tsType:{name:"number"},description:"Number of selected items",defaultValue:{value:"0",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const we={title:"Components/Pagination",component:r,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{currentPage:{control:"number",description:"현재 페이지 (1부터 시작)",table:{type:{summary:"number"}}},totalPages:{control:"number",description:"전체 페이지 수",table:{type:{summary:"number"}}},totalItems:{control:"number",description:"전체 항목 수 (표시용)",table:{type:{summary:"number"}}},selectedCount:{control:"number",description:"선택된 항목 수",table:{type:{summary:"number"},defaultValue:{summary:"0"}}},siblingCount:{control:"number",description:"현재 페이지 양옆에 표시할 페이지 수",table:{type:{summary:"number"},defaultValue:{summary:"1"}}},disabled:{control:"boolean",description:"전체 비활성화",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},showSettings:{control:"boolean",description:"설정 버튼 표시",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},P={render:function(){const[e,n]=o.useState(1);return t.jsx(r,{currentPage:e,totalPages:10,onPageChange:n})}},f={render:function(){const[e,n]=o.useState(1);return t.jsx(r,{currentPage:e,totalPages:10,totalItems:100,onPageChange:n})}},h={render:function(){const[e,n]=o.useState(1);return t.jsx(r,{currentPage:e,totalPages:10,totalItems:100,selectedCount:5,onPageChange:n})}},x={render:function(){const[e,n]=o.useState(1);return t.jsx(r,{currentPage:e,totalPages:10,totalItems:100,showSettings:!0,onSettingsClick:()=>alert("Settings clicked!"),onPageChange:n})}},b={render:function(){const[e,n]=o.useState(25);return t.jsx(r,{currentPage:e,totalPages:100,totalItems:1e3,onPageChange:n})}},v={render:function(){const[e,n]=o.useState(1);return t.jsx(r,{currentPage:e,totalPages:3,totalItems:30,onPageChange:n})}},S={render:function(){const[e,n]=o.useState(1);return t.jsx(r,{currentPage:e,totalPages:10,onPageChange:n})}},C={render:function(){const[e,n]=o.useState(10);return t.jsx(r,{currentPage:e,totalPages:10,onPageChange:n})}},y={render:()=>t.jsx(r,{currentPage:5,totalPages:10,disabled:!0,onPageChange:()=>{}})},j={render:function(){const[e,n]=o.useState(5),[i,s]=o.useState(3);return t.jsxs("div",{className:"flex flex-col gap-4",children:[t.jsx(r,{currentPage:e,totalPages:20,totalItems:200,selectedCount:i,showSettings:!0,onSettingsClick:()=>alert("Open settings"),onPageChange:n}),t.jsxs("div",{className:"flex gap-4 text-sm",children:[t.jsx("button",{className:"text-[var(--color-action-primary)]",onClick:()=>s(I=>I+1),children:"Select more"}),t.jsx("button",{className:"text-[var(--color-action-primary)]",onClick:()=>s(0),children:"Clear selection"})]})]})}};var z,D,V;P.parameters={...P.parameters,docs:{...(z=P.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: function DefaultPagination() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`,...(V=(D=P.parameters)==null?void 0:D.docs)==null?void 0:V.source}}};var M,R,E;f.parameters={...f.parameters,docs:{...(M=f.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: function WithTotalItems() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} totalItems={100} onPageChange={setPage} />;
  }
}`,...(E=(R=f.parameters)==null?void 0:R.docs)==null?void 0:E.source}}};var L,$,_;h.parameters={...h.parameters,docs:{...(L=h.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: function WithSelection() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} totalItems={100} selectedCount={5} onPageChange={setPage} />;
  }
}`,...(_=($=h.parameters)==null?void 0:$.docs)==null?void 0:_.source}}};var O,B,A;x.parameters={...x.parameters,docs:{...(O=x.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: function WithSettings() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} totalItems={100} showSettings onSettingsClick={() => alert('Settings clicked!')} onPageChange={setPage} />;
  }
}`,...(A=(B=x.parameters)==null?void 0:B.docs)==null?void 0:A.source}}};var G,H,J;b.parameters={...b.parameters,docs:{...(G=b.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: function ManyPages() {
    const [page, setPage] = useState(25);
    return <Pagination currentPage={page} totalPages={100} totalItems={1000} onPageChange={setPage} />;
  }
}`,...(J=(H=b.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,U;v.parameters={...v.parameters,docs:{...(K=v.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: function FewPages() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={3} totalItems={30} onPageChange={setPage} />;
  }
}`,...(U=(Q=v.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var X,Y,Z;S.parameters={...S.parameters,docs:{...(X=S.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: function FirstPage() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`,...(Z=(Y=S.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,ae;C.parameters={...C.parameters,docs:{...(ee=C.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: function LastPage() {
    const [page, setPage] = useState(10);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`,...(ae=(te=C.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var ne,se,re;y.parameters={...y.parameters,docs:{...(ne=y.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <Pagination currentPage={5} totalPages={10} disabled onPageChange={() => {}} />
}`,...(re=(se=y.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var oe,ie,ce;j.parameters={...j.parameters,docs:{...(oe=j.parameters)==null?void 0:oe.docs,source:{originalSource:`{
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
}`,...(ce=(ie=j.parameters)==null?void 0:ie.docs)==null?void 0:ce.source}}};const Te=["Default","WithTotalItems","WithSelection","WithSettings","ManyPages","FewPages","FirstPage","LastPage","Disabled","FullExample"];export{P as Default,y as Disabled,v as FewPages,S as FirstPage,j as FullExample,C as LastPage,b as ManyPages,h as WithSelection,x as WithSettings,f as WithTotalItems,Te as __namedExportsOrder,we as default};
