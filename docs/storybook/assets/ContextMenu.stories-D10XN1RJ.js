import{r as i,j as e}from"./iframe-DKmDJy9M.js";import{r as Me}from"./index-S5r0ZuEJ.js";import{I as Se}from"./IconChevronRight-Dymhorbf.js";import{T as Ee}from"./Tooltip-DzKnCFpx.js";import{B as w}from"./Button-BjRr-4Eh.js";import{I as je}from"./IconFile-CUzpXdlJ.js";import{I as Re}from"./IconSettings-WI1EblWW.js";import{I as Te}from"./IconEdit-BlS-DZQj.js";import{I as Ne}from"./IconCopy-wGSDVjhO.js";import{I as We}from"./IconDownload-CE0Vp-6J.js";import{c as Be}from"./createReactComponent-DB1W9lnY.js";import{I as Ie}from"./IconTrash-C_xd3OON.js";import{I as Pe}from"./IconFolder-D_s2G0G1.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=[["path",{d:"M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",key:"svg-0"}],["path",{d:"M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",key:"svg-1"}],["path",{d:"M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",key:"svg-2"}],["path",{d:"M8.7 10.7l6.6 -3.4",key:"svg-3"}],["path",{d:"M8.7 13.3l6.6 3.4",key:"svg-4"}]],Fe=Be("outline","share","Share",ze),De=({item:t,onClose:o,parentDirection:x="right",itemId:f})=>{const[v,y]=i.useState(!1),[a,l]=i.useState({x:0,y:0}),[h,M]=i.useState("right"),u=i.useRef(null),d=i.useRef(null),s=i.useRef(null);i.useEffect(()=>{if(v&&d.current&&u.current){const n=d.current.getBoundingClientRect(),m=u.current.getBoundingClientRect(),I=window.innerWidth,D=window.innerHeight,$=t.submenuDirection||"right";let g=a.x,S=a.y,E=$;$==="left"?(g=m.left-n.width-4,E="left",g<8&&(g=8)):(g=m.right+4,E="right",g+n.width>I-8&&(g=m.left-n.width-4,E="left",g<8&&(g=8))),S+n.height>D-8&&(S=Math.max(8,D-n.height-8)),(g!==a.x||S!==a.y)&&l({x:g,y:S}),M(E)}},[v,a.x,a.y,t.submenuDirection]),i.useEffect(()=>{if(!t.submenu)return;const n=m=>{var I;((I=m.detail)==null?void 0:I.itemId)!==f&&(y(!1),s.current&&(clearTimeout(s.current),s.current=null))};return window.addEventListener("close-context-submenus",n),()=>{window.removeEventListener("close-context-submenus",n)}},[t.submenu,f]);const r=()=>{if(s.current&&(clearTimeout(s.current),s.current=null),t.submenu&&u.current){window.dispatchEvent(new CustomEvent("close-context-submenus",{detail:{itemId:f}}));const n=u.current.getBoundingClientRect();(t.submenuDirection||"right")==="left"?(l({x:n.left-4,y:n.top-1}),M("left")):(l({x:n.right+4,y:n.top-1}),M("right")),y(!0)}},j=()=>{s.current=window.setTimeout(()=>{y(!1)},150)},N=()=>{s.current&&(clearTimeout(s.current),s.current=null)},c=()=>{y(!1)},C=()=>{var n;t.disabled||t.submenu||((n=t.onClick)==null||n.call(t),o())},k=n=>{var m;n.button===0&&(t.disabled||t.submenu||(n.preventDefault(),(m=t.onClick)==null||m.call(t),o()))},p=t.submenu&&t.submenu.length>0;i.useEffect(()=>()=>{s.current&&clearTimeout(s.current)},[]);const b=e.jsxs("div",{ref:u,onMouseEnter:r,onMouseLeave:j,onMouseDown:k,onClick:C,className:`
        flex items-center justify-between
        min-w-[var(--context-menu-min-width)]
        px-[var(--context-menu-padding-x)]
        py-[var(--context-menu-padding-y)]
        text-[length:var(--font-size-11)]
        leading-[var(--line-height-16)]
        whitespace-nowrap
        cursor-pointer
        transition-colors duration-[var(--duration-fast)]
        ${t.divider?"border-b border-[var(--color-border-subtle)]":""}
        ${t.status==="danger"?"text-[var(--color-state-danger-text)] hover:bg-[var(--color-state-danger-bg)]":"text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)]"}
        ${t.disabled?"opacity-50 cursor-not-allowed":""}
        ${v?"bg-[var(--context-menu-hover-bg)]":""}
      `,children:[e.jsxs("div",{className:"flex items-center gap-2 flex-1 min-w-0",children:[t.icon&&e.jsx("span",{className:"shrink-0 text-[var(--color-text-muted)] flex items-center",children:t.icon}),e.jsx("span",{className:"flex-1",children:t.label})]}),p&&e.jsx(Se,{size:12,stroke:1,className:"ml-6 shrink-0"})]});return e.jsxs(e.Fragment,{children:[t.tooltip?e.jsx(Ee,{content:t.tooltip,position:t.tooltipPosition||"left",children:b}):b,v&&t.submenu&&Me.createPortal(e.jsx("div",{ref:d,onMouseDown:n=>n.stopPropagation(),onClick:n=>n.stopPropagation(),onMouseEnter:N,onMouseLeave:c,className:`
            fixed
            flex flex-col
            bg-[var(--color-surface-default)]
            border border-[var(--color-border-strong)]
            rounded-[var(--context-menu-radius)]
            shadow-[var(--shadow-md)]
            overflow-hidden
            z-[5001]
            max-h-[calc(100vh-16px)]
            overflow-y-auto
          `,style:{left:a.x,top:a.y},children:t.submenu.map(n=>e.jsx(De,{item:n,onClose:o,parentDirection:h,itemId:n.id},n.id))}),document.body)]})},Ae=({items:t,position:o,onClose:x,parentDirection:f="right",menuRef:v,triggerRef:y,minTop:a,align:l="left",triggerWidth:h=0})=>{const M=i.useRef(null),u=v??M,[d,s]=i.useState(null);return i.useEffect(()=>{requestAnimationFrame(()=>{if(u.current){const r=u.current.getBoundingClientRect(),j=window.innerWidth,N=window.innerHeight;let c;l==="right"?c=o.x+h-r.width:c=o.x;let C=o.y;c+r.width>j-8&&(c=j-r.width-8),c<8&&(c=8),o.y+r.height>N-8&&(C=Math.max(8,N-r.height-8)),a!==void 0&&C<a&&(C=a),s({x:c,y:C})}})},[o,y,a,l,h]),Me.createPortal(e.jsx("div",{ref:u,onMouseDown:r=>r.stopPropagation(),onClick:r=>r.stopPropagation(),className:`
        fixed z-[5000]
        flex flex-col
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-strong)]
        rounded-[var(--context-menu-radius)]
        shadow-[var(--shadow-md)]
        overflow-hidden
        transition-opacity duration-[var(--duration-fast)]
      `,style:{left:(d==null?void 0:d.x)??o.x,top:(d==null?void 0:d.y)??o.y,opacity:d?1:0},children:t.map(r=>e.jsx(De,{item:r,onClose:x,parentDirection:f,itemId:r.id},r.id))}),document.body)},q=({items:t,children:o,trigger:x="contextmenu",disabled:f=!1,className:v="",minTop:y,align:a="left"})=>{const[l,h]=i.useState(!1),[M,u]=i.useState({x:0,y:0}),[d,s]=i.useState(0),r=i.useRef(null),j=i.useRef(null),N=i.useCallback(k=>{if(!f)if(x==="contextmenu"){k.preventDefault();const p=new CustomEvent("contextmenu:close-all");document.dispatchEvent(p),u({x:k.clientX,y:k.clientY}),s(0),h(!0)}else{if(l){h(!1);return}if(r.current){const p=r.current.firstElementChild,b=(p==null?void 0:p.getBoundingClientRect())??r.current.getBoundingClientRect();u({x:b.left,y:b.bottom+4}),s(b.width)}h(!0)}},[f,x,l]),c=i.useCallback(()=>{h(!1)},[]);i.useEffect(()=>{const k=n=>{var I,D;if(!l)return;const m=n.target;(I=r.current)!=null&&I.contains(m)||(D=j.current)!=null&&D.contains(m)||r.current&&c()},p=n=>{l&&n.key==="Escape"&&c()},b=()=>{l&&c()};return l&&setTimeout(()=>{document.addEventListener("click",k),document.addEventListener("keydown",p)},0),document.addEventListener("contextmenu:close-all",b),()=>{document.removeEventListener("click",k),document.removeEventListener("keydown",p),document.removeEventListener("contextmenu:close-all",b)}},[l,c]);const C=x==="contextmenu"?{onContextMenu:N}:{onClickCapture:N};return e.jsxs("div",{ref:r,className:`inline-block w-fit ${v}`,...C,children:[o,l&&e.jsx(Ae,{items:t,position:M,onClose:c,menuRef:j,triggerRef:r,minTop:y,align:a,triggerWidth:d})]})};q.__docgenInfo={description:"",methods:[],displayName:"ContextMenu",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"ContextMenuItem"}],raw:"ContextMenuItem[]"},description:"Menu items"},children:{required:!0,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:"Trigger element"},trigger:{required:!1,tsType:{name:"union",raw:"'click' | 'contextmenu'",elements:[{name:"literal",value:"'click'"},{name:"literal",value:"'contextmenu'"}]},description:"Trigger type",defaultValue:{value:"'contextmenu'",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}},minTop:{required:!1,tsType:{name:"number"},description:"Minimum top position for dropdown"},align:{required:!1,tsType:{name:"union",raw:"'left' | 'right'",elements:[{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:"Alignment of dropdown relative to trigger (for click trigger)",defaultValue:{value:"'left'",computed:!1}}}};const st={title:"Components/ContextMenu",component:q,parameters:{layout:"centered",docs:{description:{component:"우클릭 또는 클릭으로 열리는 컨텍스트 메뉴 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{trigger:{control:"select",options:["contextmenu","click"],description:"트리거 유형"},disabled:{control:"boolean",description:"비활성화 상태"},align:{control:"select",options:["left","right"],description:"메뉴 정렬 (click 트리거)"}}},_=[{id:"edit",label:"Edit",onClick:()=>console.log("Edit clicked")},{id:"copy",label:"Copy",onClick:()=>console.log("Copy clicked")},{id:"paste",label:"Paste",onClick:()=>console.log("Paste clicked")},{id:"delete",label:"Delete",status:"danger",onClick:()=>console.log("Delete clicked")}],R={args:{items:_,trigger:"contextmenu",children:e.jsx("div",{className:"w-64 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600 border-2 border-dashed border-gray-300",children:"Right-click here"})}},T={name:"Click Trigger",args:{items:_,trigger:"click",children:e.jsx(w,{variant:"secondary",children:"Click for menu"})}},Le=[{id:"edit",label:"Edit",icon:e.jsx(Te,{size:14}),onClick:()=>{}},{id:"copy",label:"Copy",icon:e.jsx(Ne,{size:14}),onClick:()=>{}},{id:"download",label:"Download",icon:e.jsx(We,{size:14}),onClick:()=>{}},{id:"share",label:"Share",icon:e.jsx(Fe,{size:14}),divider:!0,onClick:()=>{}},{id:"delete",label:"Delete",icon:e.jsx(Ie,{size:14}),status:"danger",onClick:()=>{}}],W={name:"With Icons",args:{items:Le,trigger:"click",children:e.jsx(w,{variant:"secondary",children:"Menu with icons"})}},Oe=[{id:"cut",label:"Cut",onClick:()=>{}},{id:"copy",label:"Copy",onClick:()=>{}},{id:"paste",label:"Paste",divider:!0,onClick:()=>{}},{id:"select-all",label:"Select All",divider:!0,onClick:()=>{}},{id:"settings",label:"Settings",icon:e.jsx(Re,{size:14}),onClick:()=>{}}],B={name:"With Dividers",args:{items:Oe,trigger:"click",children:e.jsx(w,{variant:"secondary",children:"Menu with dividers"})}},Ve=[{id:"new",label:"New",submenu:[{id:"new-file",label:"File",icon:e.jsx(je,{size:14}),onClick:()=>console.log("New File")},{id:"new-folder",label:"Folder",icon:e.jsx(Pe,{size:14}),onClick:()=>console.log("New Folder")}]},{id:"open",label:"Open",onClick:()=>{}},{id:"save",label:"Save",divider:!0,onClick:()=>{}},{id:"export",label:"Export",submenu:[{id:"export-pdf",label:"PDF",onClick:()=>console.log("Export PDF")},{id:"export-png",label:"PNG",onClick:()=>console.log("Export PNG")},{id:"export-svg",label:"SVG",onClick:()=>console.log("Export SVG")}]}],P={name:"With Submenu",args:{items:Ve,trigger:"click",children:e.jsx(w,{variant:"secondary",children:"Menu with submenu"})}},qe=[{id:"edit",label:"Edit",onClick:()=>{}},{id:"copy",label:"Copy",disabled:!0,onClick:()=>{}},{id:"paste",label:"Paste",disabled:!0,onClick:()=>{}},{id:"delete",label:"Delete",status:"danger",onClick:()=>{}}],z={name:"With Disabled Items",args:{items:qe,trigger:"click",children:e.jsx(w,{variant:"secondary",children:"Menu with disabled items"})}},_e=[{id:"edit",label:"Edit",tooltip:"Edit this item",tooltipPosition:"right",onClick:()=>{}},{id:"copy",label:"Copy",tooltip:"Copy to clipboard",tooltipPosition:"right",onClick:()=>{}},{id:"delete",label:"Delete",tooltip:"This action cannot be undone",tooltipPosition:"right",status:"danger",onClick:()=>{}}],F={name:"With Tooltips",args:{items:_e,trigger:"click",children:e.jsx(w,{variant:"secondary",children:"Menu with tooltips"})}},A={name:"Right Aligned",args:{items:_,trigger:"click",align:"right",children:e.jsx(w,{variant:"secondary",children:"Right-aligned menu"})}},L={args:{items:_,trigger:"click",disabled:!0,children:e.jsx(w,{variant:"secondary",disabled:!0,children:"Disabled menu"})}},O={name:"Use Case - Table Row",render:()=>{const t=[{id:"view",label:"View Details",onClick:()=>{}},{id:"edit",label:"Edit",onClick:()=>{}},{id:"duplicate",label:"Duplicate",divider:!0,onClick:()=>{}},{id:"delete",label:"Delete",status:"danger",onClick:()=>{}}];return e.jsx("div",{className:"border border-gray-200 rounded-lg overflow-hidden w-96",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 text-left",children:"Name"}),e.jsx("th",{className:"px-4 py-2 text-left",children:"Status"}),e.jsx("th",{className:"px-4 py-2 w-10"})]})}),e.jsx("tbody",{children:["Item 1","Item 2","Item 3"].map((o,x)=>e.jsxs("tr",{className:"border-t hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-2",children:o}),e.jsx("td",{className:"px-4 py-2",children:"Active"}),e.jsx("td",{className:"px-4 py-2",children:e.jsx(q,{items:t,trigger:"click",children:e.jsx("button",{className:"p-1 hover:bg-gray-100 rounded",children:"⋮"})})})]},x))})]})})}},V={name:"Use Case - File Explorer",render:()=>{const t=[{id:"open",label:"Open",onClick:()=>{}},{id:"open-with",label:"Open With...",submenu:[{id:"vscode",label:"VS Code",onClick:()=>{}},{id:"sublime",label:"Sublime Text",onClick:()=>{}},{id:"notepad",label:"Notepad",onClick:()=>{}}]},{id:"rename",label:"Rename",divider:!0,onClick:()=>{}},{id:"copy",label:"Copy",icon:e.jsx(Ne,{size:14}),onClick:()=>{}},{id:"cut",label:"Cut",onClick:()=>{}},{id:"paste",label:"Paste",divider:!0,onClick:()=>{}},{id:"delete",label:"Move to Trash",icon:e.jsx(Ie,{size:14}),status:"danger",onClick:()=>{}}];return e.jsx(q,{items:t,trigger:"contextmenu",children:e.jsxs("div",{className:"w-80 p-4 bg-gray-50 rounded-lg",children:[e.jsxs("div",{className:"flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-default",children:[e.jsx(je,{size:24,className:"text-blue-500"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium",children:"document.pdf"}),e.jsx("p",{className:"text-xs text-gray-500",children:"2.4 MB • Modified today"})]})]}),e.jsx("p",{className:"text-xs text-gray-400 mt-3 text-center",children:"Right-click on the file"})]})})}};var G,H,U;R.parameters={...R.parameters,docs:{...(G=R.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    trigger: 'contextmenu',
    children: <div className="w-64 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600 border-2 border-dashed border-gray-300">
        Right-click here
      </div>
  }
}`,...(U=(H=R.parameters)==null?void 0:H.docs)==null?void 0:U.source}}};var X,Y,J;T.parameters={...T.parameters,docs:{...(X=T.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'Click Trigger',
  args: {
    items: basicItems,
    trigger: 'click',
    children: <Button variant="secondary">Click for menu</Button>
  }
}`,...(J=(Y=T.parameters)==null?void 0:Y.docs)==null?void 0:J.source}}};var K,Q,Z;W.parameters={...W.parameters,docs:{...(K=W.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'With Icons',
  args: {
    items: itemsWithIcons,
    trigger: 'click',
    children: <Button variant="secondary">Menu with icons</Button>
  }
}`,...(Z=(Q=W.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};var ee,te,ne;B.parameters={...B.parameters,docs:{...(ee=B.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  name: 'With Dividers',
  args: {
    items: itemsWithDividers,
    trigger: 'click',
    children: <Button variant="secondary">Menu with dividers</Button>
  }
}`,...(ne=(te=B.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};var re,ie,se;P.parameters={...P.parameters,docs:{...(re=P.parameters)==null?void 0:re.docs,source:{originalSource:`{
  name: 'With Submenu',
  args: {
    items: itemsWithSubmenu,
    trigger: 'click',
    children: <Button variant="secondary">Menu with submenu</Button>
  }
}`,...(se=(ie=P.parameters)==null?void 0:ie.docs)==null?void 0:se.source}}};var oe,ae,le;z.parameters={...z.parameters,docs:{...(oe=z.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  name: 'With Disabled Items',
  args: {
    items: itemsWithDisabled,
    trigger: 'click',
    children: <Button variant="secondary">Menu with disabled items</Button>
  }
}`,...(le=(ae=z.parameters)==null?void 0:ae.docs)==null?void 0:le.source}}};var ce,de,ue;F.parameters={...F.parameters,docs:{...(ce=F.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  name: 'With Tooltips',
  args: {
    items: itemsWithTooltips,
    trigger: 'click',
    children: <Button variant="secondary">Menu with tooltips</Button>
  }
}`,...(ue=(de=F.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var me,pe,ge;A.parameters={...A.parameters,docs:{...(me=A.parameters)==null?void 0:me.docs,source:{originalSource:`{
  name: 'Right Aligned',
  args: {
    items: basicItems,
    trigger: 'click',
    align: 'right',
    children: <Button variant="secondary">Right-aligned menu</Button>
  }
}`,...(ge=(pe=A.parameters)==null?void 0:pe.docs)==null?void 0:ge.source}}};var he,be,xe;L.parameters={...L.parameters,docs:{...(he=L.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    trigger: 'click',
    disabled: true,
    children: <Button variant="secondary" disabled>Disabled menu</Button>
  }
}`,...(xe=(be=L.parameters)==null?void 0:be.docs)==null?void 0:xe.source}}};var fe,ve,ye;O.parameters={...O.parameters,docs:{...(fe=O.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  name: 'Use Case - Table Row',
  render: () => {
    const rowMenuItems = [{
      id: 'view',
      label: 'View Details',
      onClick: () => {}
    }, {
      id: 'edit',
      label: 'Edit',
      onClick: () => {}
    }, {
      id: 'duplicate',
      label: 'Duplicate',
      divider: true,
      onClick: () => {}
    }, {
      id: 'delete',
      label: 'Delete',
      status: 'danger' as const,
      onClick: () => {}
    }];
    return <div className="border border-gray-200 rounded-lg overflow-hidden w-96">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {['Item 1', 'Item 2', 'Item 3'].map((item, i) => <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item}</td>
                <td className="px-4 py-2">Active</td>
                <td className="px-4 py-2">
                  <ContextMenu items={rowMenuItems} trigger="click">
                    <button className="p-1 hover:bg-gray-100 rounded">⋮</button>
                  </ContextMenu>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>;
  }
}`,...(ye=(ve=O.parameters)==null?void 0:ve.docs)==null?void 0:ye.source}}};var Ce,ke,we;V.parameters={...V.parameters,docs:{...(Ce=V.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  name: 'Use Case - File Explorer',
  render: () => {
    const fileMenuItems = [{
      id: 'open',
      label: 'Open',
      onClick: () => {}
    }, {
      id: 'open-with',
      label: 'Open With...',
      submenu: [{
        id: 'vscode',
        label: 'VS Code',
        onClick: () => {}
      }, {
        id: 'sublime',
        label: 'Sublime Text',
        onClick: () => {}
      }, {
        id: 'notepad',
        label: 'Notepad',
        onClick: () => {}
      }]
    }, {
      id: 'rename',
      label: 'Rename',
      divider: true,
      onClick: () => {}
    }, {
      id: 'copy',
      label: 'Copy',
      icon: <IconCopy size={14} />,
      onClick: () => {}
    }, {
      id: 'cut',
      label: 'Cut',
      onClick: () => {}
    }, {
      id: 'paste',
      label: 'Paste',
      divider: true,
      onClick: () => {}
    }, {
      id: 'delete',
      label: 'Move to Trash',
      icon: <IconTrash size={14} />,
      status: 'danger' as const,
      onClick: () => {}
    }];
    return <ContextMenu items={fileMenuItems} trigger="contextmenu">
        <div className="w-80 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-default">
            <IconFile size={24} className="text-blue-500" />
            <div>
              <p className="font-medium">document.pdf</p>
              <p className="text-xs text-gray-500">2.4 MB • Modified today</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Right-click on the file</p>
        </div>
      </ContextMenu>;
  }
}`,...(we=(ke=V.parameters)==null?void 0:ke.docs)==null?void 0:we.source}}};const ot=["Default","ClickTrigger","WithIcons","WithDividers","WithSubmenu","WithDisabledItems","WithTooltips","RightAligned","Disabled","TableRowMenu","FileExplorerMenu"];export{T as ClickTrigger,R as Default,L as Disabled,V as FileExplorerMenu,A as RightAligned,O as TableRowMenu,z as WithDisabledItems,B as WithDividers,W as WithIcons,P as WithSubmenu,F as WithTooltips,ot as __namedExportsOrder,st as default};
