import{r as B,j as e}from"./iframe-DD6jyF7N.js";import{I as E}from"./IconChevronLeft-DIbUa7_K.js";import{I as L}from"./IconChevronRight-BMUG6TI6.js";import{I as O}from"./IconSettings-DbC3mb3w.js";const m=(u,g)=>{const f=g-u+1;return Array.from({length:f},(v,d)=>d+u)},c="dots",_=({currentPage:u,currentAt:g,totalPages:f,totalCount:v,size:d,onPageChange:h,siblingCount:i=1,disabled:s=!1,showSettings:C=!1,onSettingsClick:q,totalItems:b,selectedCount:N=0,className:w="",...I})=>{const a=u??g??1,t=f??(v&&d?Math.ceil(v/d):0),z=B.useMemo(()=>{if(i+5>=t)return m(1,t);const p=Math.max(a-i,1),n=Math.min(a+i,t),o=p>2,j=n<t-1,T=1,A=t;if(!o&&j){const l=3+2*i;return[...m(1,l),c,t]}if(o&&!j){const l=3+2*i,k=m(t-l+1,t);return[T,c,...k]}if(o&&j){const l=m(p,n);return[T,c,...l,c,A]}return[]},[t,i,a]),S=()=>{a>1&&!s&&h(a-1)},R=()=>{a<t&&!s&&h(a+1)},$=r=>{!s&&r!==a&&h(r)},x=t<=0,y=`
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
  `,D=`
    ${y}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    cursor-pointer
  `,V=`
    ${y}
    bg-[var(--color-action-primary)]
    text-[var(--color-text-on-primary)]
  `,P=`
    ${y}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    disabled:text-[var(--color-text-disabled)]
    disabled:cursor-not-allowed
    disabled:hover:bg-transparent
  `,M=`
    inline-flex items-center justify-center
    size-[var(--pagination-item-size)]
    text-[length:var(--pagination-font-size)]
    text-[var(--pagination-text)]
  `;return e.jsxs("nav",{"data-figma-name":"[TDS] Pagination","aria-label":"Pagination",className:`inline-flex items-center gap-[var(--pagination-gap)] ${w}`,...I,children:[e.jsx("button",{type:"button",onClick:S,disabled:s||x||a===1,className:P,"aria-label":"Previous page",children:e.jsx(E,{size:14,stroke:1})}),!x&&z.map((r,p)=>{if(r===c)return e.jsx("span",{className:M,children:"···"},`dots-${p}`);const n=r,o=n===a;return e.jsx("button",{type:"button",onClick:()=>$(n),disabled:s,className:o?V:D,"aria-label":`Page ${n}`,"aria-current":o?"page":void 0,children:n},n)}),e.jsx("button",{type:"button",onClick:R,disabled:s||x||a===t,className:P,"aria-label":"Next page",children:e.jsx(L,{size:14,stroke:1})}),C&&e.jsx("button",{type:"button",onClick:q,disabled:s,className:P,"aria-label":"Pagination settings",children:e.jsx(O,{size:16,stroke:1})}),b!==void 0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"h-4 w-px bg-[var(--color-border-default)]"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:N>0?e.jsxs("span",{children:[e.jsxs("span",{className:"text-[var(--color-text-default)] font-medium",children:[N," selected"]}),e.jsxs("span",{className:"text-[var(--color-text-muted)]",children:[" / ",b," items"]})]}):`${b} items`})]})]})};_.__docgenInfo={description:"",methods:[],displayName:"Pagination",props:{currentPage:{required:!1,tsType:{name:"number"},description:"Current active page (1-indexed)"},currentAt:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - use currentPage instead"},totalPages:{required:!1,tsType:{name:"number"},description:"Total number of pages (provide this OR totalCount+size)"},totalCount:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - use totalPages instead"},size:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - items per page, used with totalCount"},onPageChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(page: number) => void",signature:{arguments:[{type:{name:"number"},name:"page"}],return:{name:"void"}}},description:"Callback when page changes"},siblingCount:{required:!1,tsType:{name:"number"},description:"Number of sibling pages to show on each side of current page",defaultValue:{value:"1",computed:!1}},showFirstLast:{required:!1,tsType:{name:"boolean"},description:"Show first/last page buttons"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},showSettings:{required:!1,tsType:{name:"boolean"},description:"Show settings button",defaultValue:{value:"false",computed:!1}},onSettingsClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when settings button is clicked"},totalItems:{required:!1,tsType:{name:"number"},description:"Total number of items (displayed after divider)"},selectedCount:{required:!1,tsType:{name:"number"},description:"Number of selected items",defaultValue:{value:"0",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};export{_ as P};
