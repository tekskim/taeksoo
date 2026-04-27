import{r as a,j as r}from"./iframe-BGa_n0Au.js";import{r as ve}from"./index-TWFM_iTt.js";import{u as pe}from"./chunk-JZWAC4HX-BeOEhHDv.js";import{I as B}from"./IconX-Cu2ORRPW.js";import{I as be}from"./IconPlus-DTTUA607.js";import{I as J}from"./IconMinus-QE_SmDkA.js";import{I as K,a as xe}from"./IconSquares-BdpgDDa1.js";const L=a.createContext({isDesktopWindow:!1});L.Provider;function ge(){return a.useContext(L).isDesktopWindow}function he(){return a.useContext(L).controls}const we=({tabs:d,activeTab:z,onTabChange:q,onTabClose:l,onTabAdd:C,onTabReorder:v,showAddButton:D=!0,showWindowControls:h=!0,showBottomBorder:O=!0,onMinimize:P,onMaximize:V,onWindowClose:b,className:f=""})=>{const m=pe(),c=ge(),i=he(),R=h&&!c,w=c&&!!i,Q=a.useCallback(()=>{c&&i?i.onClose():b?b():m("/")},[c,i,b,m]),[y,A]=a.useState(null),[Y,I]=a.useState(null),F=a.useRef(null),[T,W]=a.useState(!1),[U,$]=a.useState(null),[Z,M]=a.useState(!1),x=a.useRef(void 0),X=a.useRef(new Set(d.map(e=>e.id))),[p,N]=a.useState(new Map),_=a.useRef(p);_.current=p;const[S,G]=a.useState(null),g=a.useRef(void 0),ee=a.useCallback((e,t,n)=>{const o=e.currentTarget.querySelector("[data-tab-label]");if(!o||o.scrollWidth<=o.clientWidth)return;const s=e.currentTarget.getBoundingClientRect();g.current=window.setTimeout(()=>{G({id:t,label:n,x:s.left+s.width/2,y:s.bottom+6})},200)},[]),te=a.useCallback(()=>{g.current&&(clearTimeout(g.current),g.current=void 0),G(null)},[]);a.useEffect(()=>()=>{g.current&&clearTimeout(g.current),x.current&&clearTimeout(x.current)},[]),a.useLayoutEffect(()=>{const e=X.current,t=new Set(d.map(s=>s.id)),n=[];t.forEach(s=>{e.has(s)||n.push(s)});const o=[...t].some(s=>e.has(s));n.length>0&&o&&N(s=>{const E=new Map(s);return n.forEach(k=>E.set(k,"enter-from")),E}),X.current=t},[d]),a.useLayoutEffect(()=>{const e=[...p.entries()].filter(([,t])=>t==="enter-from").map(([t])=>t);e.length!==0&&(e.forEach(t=>{var o;const n=(o=F.current)==null?void 0:o.querySelector(`[data-tab-id="${t}"]`);n&&n.offsetWidth}),N(t=>{const n=new Map(t);return e.forEach(o=>{n.get(o)==="enter-from"&&n.set(o,"enter-active")}),n}))},[p]),a.useEffect(()=>{if(!T)return;d.filter(t=>!t.fixed&&t.closable!==!1).length<=1&&(W(!1),M(!0),x.current=window.setTimeout(()=>{$(null),x.current=window.setTimeout(()=>{M(!1)},200)},20))},[d,T]);const re=a.useCallback((e,t)=>{if(e.propertyName!=="width"||e.target!==e.currentTarget)return;const n=_.current.get(t)==="leave";N(o=>{const s=new Map(o);return s.delete(t),s}),n&&(l==null||l(t))},[l]),ne=e=>{p.get(e)!=="leave"&&q(e)},ae=(e,t)=>{if(e.stopPropagation(),p.get(t)==="leave")return;if(d.length<=1){l==null||l(t);return}const n=e.currentTarget.closest("[data-tab-id]");n&&($(n.getBoundingClientRect().width),W(!0)),N(o=>new Map(o).set(t,"leave"))},oe=(e,t)=>{A(t),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t),requestAnimationFrame(()=>{e.target.style.opacity="0.5"})},se=e=>{A(null),I(null),e.target.style.opacity="1"},ie=(e,t)=>{e.preventDefault(),e.dataTransfer.dropEffect="move",y&&y!==t&&I(t)},le=()=>{I(null)},de=(e,t)=>{if(e.preventDefault(),I(null),!y||!v)return;const n=d.findIndex(s=>s.id===y),o=d.findIndex(s=>s.id===t);n!==-1&&o!==-1&&n!==o&&v(n,o),A(null)};return r.jsxs("div",{"data-figma-name":"[TDS] TabBar",className:`
        relative
        flex items-center
        w-full
        h-[var(--tabbar-height)]
        bg-[var(--color-surface-default)]
        ${O?"after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10":""}
        ${f}
      `,children:[r.jsx("div",{ref:F,onMouseLeave:()=>{T&&(W(!1),M(!0),x.current=window.setTimeout(()=>{$(null),x.current=window.setTimeout(()=>{M(!1)},200)},20))},className:`
          flex items-end
          overflow-hidden
          h-full
          min-w-0
        `,children:d.map(e=>{const t=e.id===z,n=e.label??e.title??"",o=e.fixed?!1:e.closable!==!1,s=y===e.id,E=Y===e.id,k=p.get(e.id),j=!!k,ce=k==="leave",H={width:0,paddingLeft:0,paddingRight:0,borderRightWidth:0,opacity:0,overflow:"hidden"},ue="width 200ms ease-out, padding-left 200ms ease-out, padding-right 200ms ease-out, border-right-width 200ms ease-out, opacity 150ms ease-out",fe="width 200ms ease-in, padding-left 200ms ease-in, padding-right 200ms ease-in, border-right-width 200ms ease-in, opacity 100ms ease-in",me=()=>{switch(k){case"enter-from":return H;case"enter-active":return{overflow:"hidden",transition:ue};case"leave":return{...H,transition:fe};default:return{}}};return r.jsxs("div",{"data-tab-id":e.id,onClick:()=>ne(e.id),onMouseEnter:u=>ee(u,e.id,n),onMouseLeave:te,draggable:!!v&&!j,onDragStart:u=>oe(u,e.id),onDragEnd:se,onDragOver:u=>ie(u,e.id),onDragLeave:le,onDrop:u=>de(u,e.id),onTransitionEnd:u=>re(u,e.id),style:{...U!=null&&!j?{width:U}:{},...me()},className:`
                group
                relative
                flex items-center
                h-full
                ${T&&!j?"shrink-0":"w-[160px] shrink"}
                min-w-0
                pl-[var(--tabbar-tab-padding-x)] pr-[var(--tabbar-tab-padding-r)]
                gap-[var(--tabbar-tab-gap)]
                ${ce?"pointer-events-none":"cursor-pointer"}
                ${Z&&!j?"transition-[color,background-color,width] duration-[var(--duration-normal)]":j?"":"transition-colors duration-[var(--duration-fast)]"}
                border-r border-[var(--color-border-subtle)]
                ${t?"bg-[var(--color-surface-default)]":"bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]"}
                ${s?"opacity-50":""}
                ${E?"border-l-2 border-l-[var(--color-action-primary)]":""}
              `,children:[t&&r.jsx("div",{className:"absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)] z-20"}),e.icon&&r.jsx("span",{className:`
                  shrink-0
                  ${t?"text-[var(--color-text-default)]":"text-[var(--color-text-muted)]"}
                `,children:e.icon}),r.jsx("span",{"data-tab-label":!0,className:`
                  flex-1
                  truncate
                  text-[length:var(--tabbar-font-size)]
                  leading-[var(--tabbar-line-height)]
                  font-medium
                  ${t?"text-[var(--color-text-default)]":"text-[var(--color-text-muted)]"}
                `,children:n}),o&&l&&r.jsx("button",{type:"button",onClick:u=>ae(u,e.id),className:`
                    shrink-0
                    size-[var(--tabbar-close-size)]
                    flex items-center justify-center
                    rounded-[var(--radius-sm)]
                    transition-all duration-[var(--duration-fast)]
                    ${t||T?"text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]":"opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-border-default)]"}
                  `,"aria-label":`Close ${n}`,children:r.jsx(B,{size:12,stroke:1})})]},e.id)})}),D&&C&&r.jsx("button",{type:"button",onClick:C,className:`
            shrink-0
            flex items-center justify-center
            size-[var(--tabbar-add-size)]
            mx-[var(--tabbar-add-margin)]
            rounded-[var(--radius-sm)]
            text-[var(--color-text-muted)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--tabbar-hover-bg)]
            hover:text-[var(--color-text-default)]
          `,"aria-label":"Add new tab",children:r.jsx(be,{size:14,stroke:1})}),r.jsx("div",{className:"flex-1 h-full",onMouseDown:w?i.onDragStart:void 0,onDoubleClick:w?i.onDoubleClick:void 0}),R&&r.jsxs("div",{className:"flex items-center gap-1 px-2",children:[r.jsx("button",{type:"button",onClick:P,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Minimize",children:r.jsx(J,{size:12,stroke:1})}),r.jsx("button",{type:"button",onClick:V,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Maximize",children:r.jsx(K,{size:12,stroke:1})}),r.jsx("button",{type:"button",onClick:Q,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Close window",children:r.jsx(B,{size:12,stroke:1})})]}),w&&r.jsxs("div",{className:"flex items-center gap-1 px-2",children:[r.jsx("button",{type:"button",onClick:i.onMinimize,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Minimize",children:r.jsx(J,{size:12,stroke:1})}),r.jsx("button",{type:"button",onClick:i.onMaximize,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":i.isMaximized?"Restore":"Maximize",children:i.isMaximized?r.jsx(xe,{size:12,stroke:1}):r.jsx(K,{size:12,stroke:1})}),r.jsx("button",{type:"button",onClick:i.onClose,className:`
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            `,"aria-label":"Close window",children:r.jsx(B,{size:12,stroke:1})})]}),S&&ve.createPortal(r.jsx("div",{role:"tooltip",className:"fixed z-[var(--z-tooltip)] pointer-events-none",style:{left:S.x,top:S.y,transform:"translateX(-50%)"},children:r.jsxs("div",{className:"relative",children:[r.jsx("div",{className:`
              bg-[var(--tooltip-bg)]
              text-[var(--tooltip-text)]
              px-[var(--tooltip-padding-x)]
              py-[var(--tooltip-padding-y)]
              rounded-[var(--tooltip-radius)]
              text-[length:var(--tooltip-font-size)]
              leading-[var(--tooltip-line-height)]
              text-left
              max-w-[var(--tooltip-max-width)]
              w-max
            `,children:S.label}),r.jsx("div",{className:"absolute top-0 -translate-y-full left-1/2 -translate-x-1/2 w-0 h-0 border-[length:var(--tooltip-arrow-size)] border-solid border-l-transparent border-r-transparent border-t-transparent border-b-[var(--tooltip-bg)]"})]})}),document.body)]})};function Ie(d={}){var b;const{initialTabs:z=[],initialActiveTab:q,onCreateTab:l}=d,[C,v]=a.useState(z),[D,h]=a.useState(q||((b=z[0])==null?void 0:b.id)||"");return{tabs:C,activeTab:D,addTab:f=>{const m=f||(l==null?void 0:l())||{id:`tab-${Date.now()}`,label:"New Tab",closable:!0};return v(c=>[...c,m]),h(m.id),m},closeTab:f=>{v(m=>{const c=m.filter(i=>i.id!==f);if(D===f&&c.length>0){const i=m.findIndex(w=>w.id===f),R=Math.min(i,c.length-1);h(c[R].id)}return c})},selectTab:f=>{h(f)},setTabs:v}}we.__docgenInfo={description:"",methods:[],displayName:"TabBar",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"TabBarItem"}],raw:"TabBarItem[]"},description:"Tab items"},activeTab:{required:!0,tsType:{name:"string"},description:"Currently active tab id"},onTabChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is selected"},onTabClose:{required:!1,tsType:{name:"signature",type:"function",raw:"(tabId: string) => void",signature:{arguments:[{type:{name:"string"},name:"tabId"}],return:{name:"void"}}},description:"Callback when tab is closed"},onTabAdd:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when add button is clicked"},onTabReorder:{required:!1,tsType:{name:"signature",type:"function",raw:"(fromIndex: number, toIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"fromIndex"},{type:{name:"number"},name:"toIndex"}],return:{name:"void"}}},description:"Callback when tabs are reordered via drag and drop"},showAddButton:{required:!1,tsType:{name:"boolean"},description:"Show add button",defaultValue:{value:"true",computed:!1}},showWindowControls:{required:!1,tsType:{name:"boolean"},description:"Show window controls (minimize, maximize, close)",defaultValue:{value:"true",computed:!1}},showBottomBorder:{required:!1,tsType:{name:"boolean"},description:"Show bottom border (default: true)",defaultValue:{value:"true",computed:!1}},onMinimize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when minimize button is clicked"},onMaximize:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when maximize button is clicked"},onWindowClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when window close button is clicked"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};export{we as T,Ie as u};
