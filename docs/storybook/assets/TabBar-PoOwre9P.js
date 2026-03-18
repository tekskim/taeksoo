import{r as u,j as t}from"./iframe-BkR05wRD.js";import{I as D}from"./IconX-pKxMf0CS.js";import{I as E}from"./IconPlus-C07gGfOe.js";import{I as O}from"./IconMinus-BolPhTm0.js";import{I as V}from"./IconSquare-B4V6g59J.js";const C=u.createContext(!1);C.Provider;function L(){return u.useContext(C)}const P=({tabs:m,activeTab:p,onTabChange:T,onTabClose:o,onTabAdd:g,onTabReorder:l,showAddButton:h=!0,showWindowControls:f=!0,showBottomBorder:I=!0,onMinimize:j,onMaximize:z,onWindowClose:w,className:r=""})=>{const s=L(),i=f&&!s,[n,v]=u.useState(null),[k,y]=u.useState(null),N=e=>{T(e)},q=(e,a)=>{e.stopPropagation(),o==null||o(a)},S=(e,a)=>{v(a),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",a),requestAnimationFrame(()=>{e.target.style.opacity="0.5"})},$=e=>{v(null),y(null),e.target.style.opacity="1"},A=(e,a)=>{e.preventDefault(),e.dataTransfer.dropEffect="move",n&&n!==a&&y(a)},B=()=>{y(null)},M=(e,a)=>{if(e.preventDefault(),y(null),!n||!l)return;const c=m.findIndex(x=>x.id===n),b=m.findIndex(x=>x.id===a);c!==-1&&b!==-1&&c!==b&&l(c,b),v(null)};return t.jsxs("div",{"data-figma-name":"[TDS] TabBar",className:`
        relative
        flex items-center
        w-full
        h-[var(--tabbar-height)]
        bg-[var(--color-surface-default)]
        ${I?"after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10":""}
        ${r}
      `,children:[t.jsx("div",{className:`
          flex items-end
          overflow-hidden
          h-full
          min-w-0
        `,children:m.map(e=>{const a=e.id===p,c=e.label??e.title??"",b=e.fixed?!1:e.closable!==!1,x=n===e.id,W=k===e.id;return t.jsxs("div",{"data-tab-id":e.id,onClick:()=>N(e.id),draggable:!!l,onDragStart:d=>S(d,e.id),onDragEnd:$,onDragOver:d=>A(d,e.id),onDragLeave:B,onDrop:d=>M(d,e.id),className:`
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
                ${x?"opacity-50":""}
                ${W?"border-l-2 border-l-[var(--color-action-primary)]":""}
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
                `,children:c}),b&&o&&t.jsx("button",{type:"button",onClick:d=>q(d,e.id),className:`
                    shrink-0
                    size-[var(--tabbar-close-size)]
                    flex items-center justify-center
                    rounded-[var(--radius-sm)]
                    transition-all duration-[var(--duration-fast)]
                    ${a?"text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]":"opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-border-default)]"}
                  `,"aria-label":`Close ${c}`,children:t.jsx(D,{size:12,stroke:1})})]},e.id)})}),h&&g&&t.jsx("button",{type:"button",onClick:g,className:`
            shrink-0
            flex items-center justify-center
            size-[var(--tabbar-add-size)]
            mx-[var(--tabbar-add-margin)]
            rounded-[var(--radius-sm)]
            text-[var(--color-text-muted)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--tabbar-hover-bg)]
            hover:text-[var(--color-text-default)]
          `,"aria-label":"Add new tab",children:t.jsx(E,{size:14,stroke:1})}),t.jsx("div",{className:"flex-1"}),i&&t.jsxs("div",{className:"flex items-center gap-1 px-2",children:[t.jsx("button",{type:"button",onClick:j,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Minimize",children:t.jsx(O,{size:12,stroke:1})}),t.jsx("button",{type:"button",onClick:z,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Maximize",children:t.jsx(V,{size:12,stroke:1})}),t.jsx("button",{type:"button",onClick:w,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-state-danger-bg)]
              hover:text-[var(--color-state-danger-text)]
            `,"aria-label":"Close window",children:t.jsx(D,{size:12,stroke:1})})]})]})};function J(m={}){var w;const{initialTabs:p=[],initialActiveTab:T,onCreateTab:o}=m,[g,l]=u.useState(p),[h,f]=u.useState(T||((w=p[0])==null?void 0:w.id)||"");return{tabs:g,activeTab:h,addTab:r=>{const s=r||(o==null?void 0:o())||{id:`tab-${Date.now()}`,label:"New Tab",closable:!0};return l(i=>[...i,s]),f(s.id),s},closeTab:r=>{l(s=>{const i=s.filter(n=>n.id!==r);if(h===r&&i.length>0){const n=s.findIndex(k=>k.id===r),v=Math.min(n,i.length-1);f(i[v].id)}return i})},selectTab:r=>{f(r)},setTabs:l}}P.__docgenInfo={description:"",methods:[],displayName:"TabBar",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"TabBarItem"}],raw:"TabBarItem[]"},description:"Tab items"},activeTab:{required:!0,tsType:{name:"string"},description:"Currently active tab id"},onTabChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is selected"},onTabClose:{required:!1,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is closed"},onTabAdd:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when add button is clicked"},onTabReorder:{required:!1,tsType:{name:"signature",type:"function",raw:"(fromIndex: number, toIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"fromIndex"},{type:{name:"number"},name:"toIndex"}],return:{name:"void"}}},description:"Callback when tabs are reordered via drag and drop"},showAddButton:{required:!1,tsType:{name:"boolean"},description:"Show add button",defaultValue:{value:"true",computed:!1}},showWindowControls:{required:!1,tsType:{name:"boolean"},description:"Show window controls (minimize, maximize, close)",defaultValue:{value:"true",computed:!1}},showBottomBorder:{required:!1,tsType:{name:"boolean"},description:"Show bottom border (default: true)",defaultValue:{value:"true",computed:!1}},onMinimize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when minimize button is clicked"},onMaximize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when maximize button is clicked"},onWindowClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when window close button is clicked"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};export{P as T,J as u};
