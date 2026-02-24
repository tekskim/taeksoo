import{r as m,j as t}from"./iframe-C-CGJmyb.js";import{C as k}from"./Checkbox-DtJhGuG-.js";import{c as G}from"./createReactComponent-BvK7gRRe.js";import{I as P}from"./IconChevronUp-8HuYYIfT.js";import{I as B}from"./IconChevronDown-Db3dj90x.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M8 9l4 -4l4 4",key:"svg-0"}],["path",{d:"M16 15l-4 4l-4 -4",key:"svg-1"}]],J=G("outline","selector","Selector",H);function L({columns:N,data:q,rows:$,rowKey:f,selectable:p=!1,selectedKeys:n=[],onSelectionChange:s,hideSelectAll:V=!1,stickyHeader:_=!1,maxHeight:u,onRowClick:v,emptyMessage:z="No data",className:A="",rowHeight:g}){const x=q??$??[],y=N.map(e=>({...e,label:e.label||e.header||""})),[o,w]=m.useState(null),[c,h]=m.useState(null),T=m.useCallback(e=>typeof f=="function"?f(e):String(e[f]),[f]),D=e=>{o===e?c==="asc"?h("desc"):c==="desc"&&(w(null),h(null)):(w(e),h("asc"))},d=m.useMemo(()=>!o||!c?x:[...x].sort((e,r)=>{const l=e[o],i=r[o];if(l===i)return 0;if(l==null)return 1;if(i==null)return-1;const a=l<i?-1:1;return c==="asc"?a:-a}),[x,o,c]),I=e=>{n.includes(e)?s==null||s(n.filter(r=>r!==e)):s==null||s([...n,e])},W=()=>{const e=d.map(T);n.length===d.length&&d.length>0?s==null||s([]):s==null||s(e)},R=d.length>0&&n.length===d.length,F=n.length>0&&n.length<d.length,M=e=>o!==e?t.jsx(J,{size:14,stroke:1,className:"text-[var(--color-text-disabled)]"}):c==="asc"?t.jsx(P,{size:14,stroke:1,className:"text-[var(--color-action-primary)]"}):t.jsx(B,{size:14,stroke:1,className:"text-[var(--color-action-primary)]"}),S=_||!!u,j=e=>{const r={};return e.width?(r.width=e.width,r.flexShrink=0,r.flexGrow=0):(r.flex=e.flex??1,r.minWidth=0),e.minWidth&&(r.minWidth=e.minWidth),e.maxWidth&&(r.maxWidth=e.maxWidth),r};return t.jsx("div",{className:`flex flex-col gap-[var(--table-row-gap)] ${A}`,style:g?{"--table-row-height":g}:void 0,children:t.jsx("div",{className:`overflow-x-auto ${u?"overflow-y-auto":""}`,style:{...u?{maxHeight:u}:{}},children:t.jsxs("div",{className:"min-w-fit w-full",children:[t.jsxs("div",{className:`
            flex items-stretch
            min-h-[var(--table-row-height)]
            w-full
            bg-[var(--table-header-bg)]
            border border-[var(--color-border-default)]
            rounded-[var(--table-row-radius)]
            ${S?"sticky top-0 z-10":""}
          `,children:[p&&t.jsx("div",{className:`
                shrink-0
                flex items-center
                w-[var(--table-checkbox-width)]
                px-[var(--table-cell-padding-x)]
                py-[var(--table-header-padding-y)]
              `,children:!V&&t.jsx(k,{checked:R,indeterminate:F,onChange:W,"aria-label":"Select all rows"})}),y.map((e,r)=>{const i=r===0?p:!0;return t.jsx("div",{className:`
                  flex items-center
                  px-[var(--table-cell-padding-x)]
                  py-[var(--table-header-padding-y)]
                  text-[length:var(--table-header-font-size)]
                  leading-[var(--table-line-height)]
                  font-medium
                  text-[var(--color-text-default)]
                  min-w-0
                  overflow-hidden
                  ${e.align==="center"?"text-center":e.align==="right"?"text-right":"text-left"}
                  ${e.sortable?"cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors":""}
                  ${i?"border-l border-[var(--color-border-default)]":""}
                `,style:j(e),onClick:e.sortable?()=>D(e.key):void 0,title:e.label,children:e.headerRender?e.headerRender():t.jsxs("div",{className:`
                      flex items-center gap-1 w-full min-w-0
                      ${e.align==="center"?"justify-center":e.align==="right"?"justify-end flex-row-reverse":"justify-start"}
                    `,children:[t.jsx("span",{className:"whitespace-nowrap truncate",title:e.label,children:e.label}),e.sortable&&t.jsx("span",{className:"flex-shrink-0",children:M(e.key)})]})},e.key)})]}),t.jsx("div",{className:"flex flex-col gap-[var(--table-row-gap)] mt-[var(--table-row-gap)] w-full",children:d.length===0?t.jsx("div",{className:`
                px-[var(--table-cell-padding-x)]
                py-[var(--table-empty-padding-y)]
                text-center
                text-[length:var(--table-font-size)]
                text-[var(--color-text-muted)]
                border border-[var(--color-border-default)]
                rounded-[var(--table-row-radius)]
                bg-[var(--color-surface-default)]
              `,children:z}):d.map((e,r)=>{const l=T(e),i=n.includes(l);return t.jsxs("div",{className:`
                    flex items-stretch
                    min-h-[var(--table-row-height)]
                    w-full
                    rounded-[var(--table-row-radius)]
                    transition-all
                    hover:bg-[var(--table-row-hover-bg)]
                    border border-[var(--color-border-default)]
                    ${i?"bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]":"bg-[var(--color-surface-default)]"}
                    ${v?"cursor-pointer":""}
                  `,onClick:v?()=>v(e,r):void 0,children:[p&&t.jsx("div",{className:`
                        shrink-0
                        flex items-center
                        w-[var(--table-checkbox-width)]
                        px-[var(--table-cell-padding-x)]
                        py-[var(--table-cell-padding-y)]
                      `,onClick:a=>a.stopPropagation(),children:t.jsx(k,{checked:i,onChange:()=>I(l),"aria-label":`Select row ${r+1}`})}),y.map((a,E)=>{const U=E===0?p:!0,b=e[a.key],C=typeof b=="string"||typeof b=="number"?String(b):void 0;return t.jsx("div",{className:`
                          flex items-center
                          px-[var(--table-cell-padding-x)]
                          py-[var(--table-cell-padding-y)]
                          text-[length:var(--table-font-size)]
                          leading-[var(--table-line-height)]
                          text-[var(--color-text-default)]
                          min-w-0
                          overflow-hidden
                          ${a.align==="center"?"justify-center text-center":a.align==="right"?"justify-end text-right":"justify-start text-left"}
                          ${U?"border-l border-transparent":""}
                        `,style:j(a),title:C,children:a.render?t.jsx("span",{className:`w-full min-w-0 overflow-hidden ${a.align==="center"?"flex justify-center":a.align==="right"?"flex justify-end":""}`,children:a.render(e[a.key],e,r)}):t.jsx("span",{className:`truncate w-full ${a.align==="center"?"text-center":a.align==="right"?"text-right":""}`,children:e[a.key]})},a.key)})]},l)})})]})})})}L.__docgenInfo={description:"",methods:[],displayName:"Table",props:{columns:{required:!0,tsType:{name:"Array",elements:[{name:"TableColumn",elements:[{name:"T"}],raw:"TableColumn<T>"}],raw:"TableColumn<T>[]"},description:""},data:{required:!1,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:"Table data"},rows:{required:!1,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:"@deprecated Use data instead (thaki-ui compatibility)"},rowKey:{required:!0,tsType:{name:"union",raw:"keyof T | ((row: T) => string)",elements:[{name:"T"},{name:"unknown"}]},description:""},selectable:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},selectedKeys:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:"[]",computed:!1}},onSelectionChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(keys: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"keys"}],return:{name:"void"}}},description:""},hideSelectAll:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},stickyHeader:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},maxHeight:{required:!1,tsType:{name:"string"},description:""},onRowClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(row: T, rowIndex: number) => void",signature:{arguments:[{type:{name:"T"},name:"row"},{type:{name:"number"},name:"rowIndex"}],return:{name:"void"}}},description:""},emptyMessage:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'No data'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},rowHeight:{required:!1,tsType:{name:"string"},description:""}}};export{L as T};
