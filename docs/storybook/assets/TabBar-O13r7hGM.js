import{r as y,j as t}from"./iframe-C-CGJmyb.js";import{I as z}from"./IconX---FUZfxB.js";import{I as B}from"./IconPlus-18QXzXZX.js";import{I as M}from"./IconMinus-B64vmpJw.js";import{I as E}from"./IconSquare-myljymI_.js";const O=({tabs:u,activeTab:x,onTabChange:w,onTabClose:s,onTabAdd:p,onTabReorder:i,showAddButton:g=!0,showWindowControls:m=!0,showBottomBorder:k=!0,onMinimize:I,onMaximize:j,onWindowClose:h,className:o=""})=>{const[r,n]=y.useState(null),[f,d]=y.useState(null),T=e=>{w(e)},D=(e,a)=>{e.stopPropagation(),s==null||s(a)},C=(e,a)=>{n(a),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",a),requestAnimationFrame(()=>{e.target.style.opacity="0.5"})},N=e=>{n(null),d(null),e.target.style.opacity="1"},q=(e,a)=>{e.preventDefault(),e.dataTransfer.dropEffect="move",r&&r!==a&&d(a)},S=()=>{d(null)},$=(e,a)=>{if(e.preventDefault(),d(null),!r||!i)return;const c=u.findIndex(b=>b.id===r),v=u.findIndex(b=>b.id===a);c!==-1&&v!==-1&&c!==v&&i(c,v),n(null)};return t.jsxs("div",{className:`
        relative
        flex items-center
        w-full
        h-[var(--tabbar-height)]
        bg-[var(--color-surface-default)]
        ${k?"after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10":""}
        ${o}
      `,children:[t.jsx("div",{className:`
          flex items-end
          overflow-hidden
          h-full
          min-w-0
        `,children:u.map(e=>{const a=e.id===x,c=e.label??e.title??"",v=e.fixed?!1:e.closable!==!1,b=r===e.id,A=f===e.id;return t.jsxs("div",{"data-tab-id":e.id,onClick:()=>T(e.id),draggable:!!i,onDragStart:l=>C(l,e.id),onDragEnd:N,onDragOver:l=>q(l,e.id),onDragLeave:S,onDrop:l=>$(l,e.id),className:`
                group
                relative
                flex items-center
                h-full
                w-[160px]
                min-w-0
                shrink
                px-[var(--tabbar-tab-padding-x)]
                gap-[var(--tabbar-tab-gap)]
                cursor-pointer
                transition-colors duration-[var(--duration-fast)]
                border-r border-[var(--color-border-subtle)]
                ${a?"bg-[var(--color-surface-default)]":"bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)]"}
                ${b?"opacity-50":""}
                ${A?"border-l-2 border-l-[var(--color-action-primary)]":""}
              `,children:[a&&t.jsx("div",{className:"absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)] z-20"}),e.icon&&t.jsx("span",{className:`
                  shrink-0
                  ${a?"text-[var(--color-text-default)]":"text-[var(--color-text-muted)]"}
                `,children:e.icon}),t.jsx("span",{className:`
                  flex-1
                  truncate
                  text-[length:var(--tabbar-font-size)]
                  leading-[var(--tabbar-line-height)]
                  font-medium
                  ${a?"text-[var(--color-text-default)]":"text-[var(--color-text-muted)]"}
                `,children:c}),v&&s&&t.jsx("button",{type:"button",onClick:l=>D(l,e.id),className:`
                    shrink-0
                    size-[var(--tabbar-close-size)]
                    flex items-center justify-center
                    rounded-[var(--radius-sm)]
                    transition-all duration-[var(--duration-fast)]
                    ${a?"text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]":"opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-border-default)]"}
                  `,"aria-label":`Close ${c}`,children:t.jsx(z,{size:12,stroke:1})})]},e.id)})}),g&&p&&t.jsx("button",{type:"button",onClick:p,className:`
            shrink-0
            flex items-center justify-center
            size-[var(--tabbar-add-size)]
            mx-[var(--tabbar-add-margin)]
            rounded-[var(--radius-sm)]
            text-[var(--color-text-muted)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--tabbar-hover-bg)]
            hover:text-[var(--color-text-default)]
          `,"aria-label":"Add new tab",children:t.jsx(B,{size:14,stroke:1})}),t.jsx("div",{className:"flex-1"}),m&&t.jsxs("div",{className:"flex items-center gap-1 px-2",children:[t.jsx("button",{type:"button",onClick:I,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Minimize",children:t.jsx(M,{size:12,stroke:1})}),t.jsx("button",{type:"button",onClick:j,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Maximize",children:t.jsx(E,{size:12,stroke:1})}),t.jsx("button",{type:"button",onClick:h,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-state-danger-bg)]
              hover:text-[var(--color-state-danger-text)]
            `,"aria-label":"Close window",children:t.jsx(z,{size:12,stroke:1})})]})]})};function F(u={}){var h;const{initialTabs:x=[],initialActiveTab:w,onCreateTab:s}=u,[p,i]=y.useState(x),[g,m]=y.useState(w||((h=x[0])==null?void 0:h.id)||"");return{tabs:p,activeTab:g,addTab:o=>{const r=o||(s==null?void 0:s())||{id:`tab-${Date.now()}`,label:"New Tab",closable:!0};return i(n=>[...n,r]),m(r.id),r},closeTab:o=>{i(r=>{const n=r.filter(f=>f.id!==o);if(g===o&&n.length>0){const f=r.findIndex(T=>T.id===o),d=Math.min(f,n.length-1);m(n[d].id)}return n})},selectTab:o=>{m(o)},setTabs:i}}O.__docgenInfo={description:"",methods:[],displayName:"TabBar",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"TabBarItem"}],raw:"TabBarItem[]"},description:"Tab items"},activeTab:{required:!0,tsType:{name:"string"},description:"Currently active tab id"},onTabChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is selected"},onTabClose:{required:!1,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is closed"},onTabAdd:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when add button is clicked"},onTabReorder:{required:!1,tsType:{name:"signature",type:"function",raw:"(fromIndex: number, toIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"fromIndex"},{type:{name:"number"},name:"toIndex"}],return:{name:"void"}}},description:"Callback when tabs are reordered via drag and drop"},showAddButton:{required:!1,tsType:{name:"boolean"},description:"Show add button",defaultValue:{value:"true",computed:!1}},showWindowControls:{required:!1,tsType:{name:"boolean"},description:"Show window controls (minimize, maximize, close)",defaultValue:{value:"true",computed:!1}},showBottomBorder:{required:!1,tsType:{name:"boolean"},description:"Show bottom border (default: true)",defaultValue:{value:"true",computed:!1}},onMinimize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when minimize button is clicked"},onMaximize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when maximize button is clicked"},onWindowClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when window close button is clicked"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};export{O as T,F as u};
