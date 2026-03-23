import{r as c,j as t}from"./iframe-CzLct1Ct.js";import{u as V}from"./chunk-JZWAC4HX-C7nbi7mi.js";import{I as C}from"./IconX-Br_T-QG9.js";import{I as L}from"./IconPlus-Bx9Ryng2.js";import{I as P}from"./IconMinus-C--IzGJr.js";import{I as _}from"./IconSquare-B6gxOpBh.js";const N=c.createContext(!1);N.Provider;function F(){return c.useContext(N)}const X=({tabs:f,activeTab:g,onTabChange:T,onTabClose:o,onTabAdd:h,onTabReorder:i,showAddButton:y=!0,showWindowControls:v=!0,showBottomBorder:j=!0,onMinimize:z,onMaximize:D,onWindowClose:u,className:r=""})=>{const n=V(),s=F(),b=v&&!s,k=c.useCallback(()=>{u?u():n("/")},[u,n]),[l,I]=c.useState(null),[q,w]=c.useState(null),S=e=>{T(e)},$=(e,a)=>{e.stopPropagation(),o==null||o(a)},A=(e,a)=>{I(a),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",a),requestAnimationFrame(()=>{e.target.style.opacity="0.5"})},B=e=>{I(null),w(null),e.target.style.opacity="1"},M=(e,a)=>{e.preventDefault(),e.dataTransfer.dropEffect="move",l&&l!==a&&w(a)},E=()=>{w(null)},O=(e,a)=>{if(e.preventDefault(),w(null),!l||!i)return;const m=f.findIndex(x=>x.id===l),p=f.findIndex(x=>x.id===a);m!==-1&&p!==-1&&m!==p&&i(m,p),I(null)};return t.jsxs("div",{"data-figma-name":"[TDS] TabBar",className:`
        relative
        flex items-center
        w-full
        h-[var(--tabbar-height)]
        bg-[var(--color-surface-default)]
        ${j?"after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10":""}
        ${r}
      `,children:[t.jsx("div",{className:`
          flex items-end
          overflow-hidden
          h-full
          min-w-0
        `,children:f.map(e=>{const a=e.id===g,m=e.label??e.title??"",p=e.fixed?!1:e.closable!==!1,x=l===e.id,W=q===e.id;return t.jsxs("div",{"data-tab-id":e.id,onClick:()=>S(e.id),draggable:!!i,onDragStart:d=>A(d,e.id),onDragEnd:B,onDragOver:d=>M(d,e.id),onDragLeave:E,onDrop:d=>O(d,e.id),className:`
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
                `,children:m}),p&&o&&t.jsx("button",{type:"button",onClick:d=>$(d,e.id),className:`
                    shrink-0
                    size-[var(--tabbar-close-size)]
                    flex items-center justify-center
                    rounded-[var(--radius-sm)]
                    transition-all duration-[var(--duration-fast)]
                    ${a?"text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]":"opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-border-default)]"}
                  `,"aria-label":`Close ${m}`,children:t.jsx(C,{size:12,stroke:1})})]},e.id)})}),y&&h&&t.jsx("button",{type:"button",onClick:h,className:`
            shrink-0
            flex items-center justify-center
            size-[var(--tabbar-add-size)]
            mx-[var(--tabbar-add-margin)]
            rounded-[var(--radius-sm)]
            text-[var(--color-text-muted)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--tabbar-hover-bg)]
            hover:text-[var(--color-text-default)]
          `,"aria-label":"Add new tab",children:t.jsx(L,{size:14,stroke:1})}),t.jsx("div",{className:"flex-1"}),b&&t.jsxs("div",{className:"flex items-center gap-1 px-2",children:[t.jsx("button",{type:"button",onClick:z,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Minimize",children:t.jsx(P,{size:12,stroke:1})}),t.jsx("button",{type:"button",onClick:D,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Maximize",children:t.jsx(_,{size:12,stroke:1})}),t.jsx("button",{type:"button",onClick:k,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-state-danger-bg)]
              hover:text-[var(--color-state-danger-text)]
            `,"aria-label":"Close window",children:t.jsx(C,{size:12,stroke:1})})]})]})};function U(f={}){var u;const{initialTabs:g=[],initialActiveTab:T,onCreateTab:o}=f,[h,i]=c.useState(g),[y,v]=c.useState(T||((u=g[0])==null?void 0:u.id)||"");return{tabs:h,activeTab:y,addTab:r=>{const n=r||(o==null?void 0:o())||{id:`tab-${Date.now()}`,label:"New Tab",closable:!0};return i(s=>[...s,n]),v(n.id),n},closeTab:r=>{i(n=>{const s=n.filter(b=>b.id!==r);if(y===r&&s.length>0){const b=n.findIndex(l=>l.id===r),k=Math.min(b,s.length-1);v(s[k].id)}return s})},selectTab:r=>{v(r)},setTabs:i}}X.__docgenInfo={description:"",methods:[],displayName:"TabBar",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"TabBarItem"}],raw:"TabBarItem[]"},description:"Tab items"},activeTab:{required:!0,tsType:{name:"string"},description:"Currently active tab id"},onTabChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is selected"},onTabClose:{required:!1,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is closed"},onTabAdd:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when add button is clicked"},onTabReorder:{required:!1,tsType:{name:"signature",type:"function",raw:"(fromIndex: number, toIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"fromIndex"},{type:{name:"number"},name:"toIndex"}],return:{name:"void"}}},description:"Callback when tabs are reordered via drag and drop"},showAddButton:{required:!1,tsType:{name:"boolean"},description:"Show add button",defaultValue:{value:"true",computed:!1}},showWindowControls:{required:!1,tsType:{name:"boolean"},description:"Show window controls (minimize, maximize, close)",defaultValue:{value:"true",computed:!1}},showBottomBorder:{required:!1,tsType:{name:"boolean"},description:"Show bottom border (default: true)",defaultValue:{value:"true",computed:!1}},onMinimize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when minimize button is clicked"},onMaximize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when maximize button is clicked"},onWindowClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when window close button is clicked"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};export{X as T,U as u};
