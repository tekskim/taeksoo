import{r as A,j as e}from"./iframe-DkQu90e3.js";import{I as B}from"./IconChevronLeft-C8ca2G7w.js";import{I as L}from"./IconChevronRight-CI0CgaLS.js";import{I as O}from"./IconSettings-Ys0yrRzw.js";const m=(u,g)=>{const f=g-u+1;return Array.from({length:f},(v,d)=>d+u)},c="dots",_=({currentPage:u,currentAt:g,totalPages:f,totalCount:v,size:d,onPageChange:h,siblingCount:i=1,disabled:s=!1,showSettings:k=!1,onSettingsClick:C,totalItems:b,selectedCount:j=0,className:q="",...w})=>{const a=u??g??1,t=f??(v&&d?Math.ceil(v/d):0),I=A.useMemo(()=>{if(i+5>=t)return m(1,t);const p=Math.max(a-i,1),n=Math.min(a+i,t),o=p>2,P=n<t-1,N=1,M=t;if(!o&&P){const l=3+2*i;return[...m(1,l),c,t]}if(o&&!P){const l=3+2*i,T=m(t-l+1,t);return[N,c,...T]}if(o&&P){const l=m(p,n);return[N,c,...l,c,M]}return[]},[t,i,a]),z=()=>{a>1&&!s&&h(a-1)},R=()=>{a<t&&!s&&h(a+1)},S=r=>{!s&&r!==a&&h(r)};if(t<=0)return null;const x=`
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
  `,$=`
    ${x}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    cursor-pointer
  `,V=`
    ${x}
    bg-[var(--color-action-primary)]
    text-[var(--color-text-on-primary)]
  `,y=`
    ${x}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    disabled:text-[var(--color-text-disabled)]
    disabled:cursor-not-allowed
    disabled:hover:bg-transparent
  `,D=`
    inline-flex items-center justify-center
    size-[var(--pagination-item-size)]
    text-[length:var(--pagination-font-size)]
    text-[var(--pagination-text)]
  `;return e.jsxs("nav",{"data-figma-name":"Pagination","aria-label":"Pagination",className:`inline-flex items-center gap-[var(--pagination-gap)] ${q}`,...w,children:[e.jsx("button",{type:"button",onClick:z,disabled:s||a===1,className:y,"aria-label":"Previous page",children:e.jsx(B,{size:14,stroke:1})}),I.map((r,p)=>{if(r===c)return e.jsx("span",{className:D,children:"···"},`dots-${p}`);const n=r,o=n===a;return e.jsx("button",{type:"button",onClick:()=>S(n),disabled:s,className:o?V:$,"aria-label":`Page ${n}`,"aria-current":o?"page":void 0,children:n},n)}),e.jsx("button",{type:"button",onClick:R,disabled:s||a===t,className:y,"aria-label":"Next page",children:e.jsx(L,{size:14,stroke:1})}),k&&e.jsx("button",{type:"button",onClick:C,disabled:s,className:y,"aria-label":"Pagination settings",children:e.jsx(O,{size:16,stroke:1})}),b!==void 0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"h-4 w-px bg-[var(--color-border-default)]"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:j>0?e.jsxs("span",{children:[e.jsxs("span",{className:"text-[var(--color-text-default)] font-medium",children:[j," selected"]}),e.jsxs("span",{className:"text-[var(--color-text-muted)]",children:[" / ",b," items"]})]}):`${b} items`})]})]})};_.__docgenInfo={description:"",methods:[],displayName:"Pagination",props:{currentPage:{required:!1,tsType:{name:"number"},description:"Current active page (1-indexed)"},currentAt:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - use currentPage instead"},totalPages:{required:!1,tsType:{name:"number"},description:"Total number of pages (provide this OR totalCount+size)"},totalCount:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - use totalPages instead"},size:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - items per page, used with totalCount"},onPageChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(page: number) => void",signature:{arguments:[{type:{name:"number"},name:"page"}],return:{name:"void"}}},description:"Callback when page changes"},siblingCount:{required:!1,tsType:{name:"number"},description:"Number of sibling pages to show on each side of current page",defaultValue:{value:"1",computed:!1}},showFirstLast:{required:!1,tsType:{name:"boolean"},description:"Show first/last page buttons"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},showSettings:{required:!1,tsType:{name:"boolean"},description:"Show settings button",defaultValue:{value:"false",computed:!1}},onSettingsClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when settings button is clicked"},totalItems:{required:!1,tsType:{name:"number"},description:"Total number of items (displayed after divider)"},selectedCount:{required:!1,tsType:{name:"number"},description:"Number of selected items",defaultValue:{value:"0",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};export{_ as P};
