import{j as e}from"./iframe-CzLct1Ct.js";import{C as v}from"./ContextMenu-DwlkuhQb.js";import{B as i}from"./Button-kAA1kjx0.js";import{I as Q}from"./IconFile-BKUah9zS.js";import{I as ee}from"./IconSettings-BXa-o0yY.js";import{I as ie}from"./IconEdit-C4TPH2hK.js";import{I as X}from"./IconCopy-CB-0roxe.js";import{I as te}from"./IconDownload-BOd9ddwU.js";import{I as re}from"./IconShare-CohAgpGI.js";import{I as Y}from"./IconTrash-oozeluA6.js";import{I as ae}from"./IconFolder-CC9T0sUh.js";import"./preload-helper-C1FmrZbK.js";import"./index-CZa75-BM.js";import"./IconChevronRight-CGyay9dN.js";import"./createReactComponent-Djx9unWR.js";import"./Tooltip-DBLkmXcb.js";import"./cn-BMXv33oC.js";const De={title:"Components/ContextMenu",component:v,parameters:{layout:"centered",docs:{description:{component:"우클릭 또는 클릭으로 열리는 컨텍스트 메뉴 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{trigger:{control:"select",options:["contextmenu","click"],description:"트리거 유형"},disabled:{control:"boolean",description:"비활성화 상태"},align:{control:"select",options:["left","right"],description:"메뉴 정렬 (click 트리거)"}}},u=[{id:"edit",label:"Edit",onClick:()=>console.log("Edit clicked")},{id:"copy",label:"Copy",onClick:()=>console.log("Copy clicked")},{id:"paste",label:"Paste",onClick:()=>console.log("Paste clicked")},{id:"delete",label:"Delete",status:"danger",onClick:()=>console.log("Delete clicked")}],t={args:{items:u,trigger:"contextmenu",children:e.jsx("div",{className:"w-64 h-32 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex items-center justify-center text-body-md text-[var(--color-text-muted)] border-2 border-dashed border-[var(--color-border-default)]",children:"Right-click here"})}},r={name:"Click Trigger",args:{items:u,trigger:"click",children:e.jsx(i,{variant:"secondary",children:"Click for menu"})}},se=[{id:"edit",label:"Edit",icon:e.jsx(ie,{size:14}),onClick:()=>{}},{id:"copy",label:"Copy",icon:e.jsx(X,{size:14}),onClick:()=>{}},{id:"download",label:"Download",icon:e.jsx(te,{size:14}),onClick:()=>{}},{id:"share",label:"Share",icon:e.jsx(re,{size:14}),divider:!0,onClick:()=>{}},{id:"delete",label:"Delete",icon:e.jsx(Y,{size:14}),status:"danger",onClick:()=>{}}],a={name:"With Icons",args:{items:se,trigger:"click",children:e.jsx(i,{variant:"secondary",children:"Menu with icons"})}},oe=[{id:"cut",label:"Cut",onClick:()=>{}},{id:"copy",label:"Copy",onClick:()=>{}},{id:"paste",label:"Paste",divider:!0,onClick:()=>{}},{id:"select-all",label:"Select All",divider:!0,onClick:()=>{}},{id:"settings",label:"Settings",icon:e.jsx(ee,{size:14}),onClick:()=>{}}],s={name:"With Dividers",args:{items:oe,trigger:"click",children:e.jsx(i,{variant:"secondary",children:"Menu with dividers"})}},le=[{id:"new",label:"New",submenu:[{id:"new-file",label:"File",icon:e.jsx(Q,{size:14}),onClick:()=>console.log("New File")},{id:"new-folder",label:"Folder",icon:e.jsx(ae,{size:14}),onClick:()=>console.log("New Folder")}]},{id:"open",label:"Open",onClick:()=>{}},{id:"save",label:"Save",divider:!0,onClick:()=>{}},{id:"export",label:"Export",submenu:[{id:"export-pdf",label:"PDF",onClick:()=>console.log("Export PDF")},{id:"export-png",label:"PNG",onClick:()=>console.log("Export PNG")},{id:"export-svg",label:"SVG",onClick:()=>console.log("Export SVG")}]}],o={name:"With Submenu",args:{items:le,trigger:"click",children:e.jsx(i,{variant:"secondary",children:"Menu with submenu"})}},ce=[{id:"edit",label:"Edit",onClick:()=>{}},{id:"copy",label:"Copy",disabled:!0,onClick:()=>{}},{id:"paste",label:"Paste",disabled:!0,onClick:()=>{}},{id:"delete",label:"Delete",status:"danger",onClick:()=>{}}],l={name:"With Disabled Items",args:{items:ce,trigger:"click",children:e.jsx(i,{variant:"secondary",children:"Menu with disabled items"})}},ne=[{id:"edit",label:"Edit",tooltip:"Edit this item",tooltipPosition:"right",onClick:()=>{}},{id:"copy",label:"Copy",tooltip:"Copy to clipboard",tooltipPosition:"right",onClick:()=>{}},{id:"delete",label:"Delete",tooltip:"This action cannot be undone",tooltipPosition:"right",status:"danger",onClick:()=>{}}],c={name:"With Tooltips",args:{items:ne,trigger:"click",children:e.jsx(i,{variant:"secondary",children:"Menu with tooltips"})}},n={name:"Right Aligned",args:{items:u,trigger:"click",align:"right",children:e.jsx(i,{variant:"secondary",children:"Right-aligned menu"})}},d={args:{items:u,trigger:"click",disabled:!0,children:e.jsx(i,{variant:"secondary",disabled:!0,children:"Disabled menu"})}},m={name:"Use Case - Table Row",render:()=>{const g=[{id:"view",label:"View Details",onClick:()=>{}},{id:"edit",label:"Edit",onClick:()=>{}},{id:"duplicate",label:"Duplicate",divider:!0,onClick:()=>{}},{id:"delete",label:"Delete",status:"danger",onClick:()=>{}}];return e.jsx("div",{className:"border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] overflow-hidden w-96",children:e.jsxs("table",{className:"w-full text-body-md",children:[e.jsx("thead",{className:"bg-[var(--color-surface-subtle)]",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left",children:"Name"}),e.jsx("th",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left",children:"Status"}),e.jsx("th",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] w-10"})]})}),e.jsx("tbody",{children:["Item 1","Item 2","Item 3"].map((Z,$)=>e.jsxs("tr",{className:"border-t hover:bg-[var(--color-surface-subtle)]",children:[e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:Z}),e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:"Active"}),e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:e.jsx(v,{items:g,trigger:"click",align:"right",children:e.jsx("button",{className:"p-[var(--primitive-spacing-1)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)]",children:"⋮"})})})]},$))})]})})}},p={name:"Use Case - File Explorer",render:()=>{const g=[{id:"open",label:"Open",onClick:()=>{}},{id:"open-with",label:"Open With...",submenu:[{id:"vscode",label:"VS Code",onClick:()=>{}},{id:"sublime",label:"Sublime Text",onClick:()=>{}},{id:"notepad",label:"Notepad",onClick:()=>{}}]},{id:"rename",label:"Rename",divider:!0,onClick:()=>{}},{id:"copy",label:"Copy",icon:e.jsx(X,{size:14}),onClick:()=>{}},{id:"cut",label:"Cut",onClick:()=>{}},{id:"paste",label:"Paste",divider:!0,onClick:()=>{}},{id:"delete",label:"Move to Trash",icon:e.jsx(Y,{size:14}),status:"danger",onClick:()=>{}}];return e.jsx(v,{items:g,trigger:"contextmenu",children:e.jsxs("div",{className:"w-80 p-[var(--primitive-spacing-4)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]",children:[e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-3)] p-[var(--primitive-spacing-3)] bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-md)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)] cursor-default",children:[e.jsx(Q,{size:24,className:"text-[var(--color-state-info)]"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)]",children:"document.pdf"}),e.jsx("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"2.4 MB • Modified today"})]})]}),e.jsx("p",{className:"text-body-sm text-[var(--color-text-subtle)] mt-[var(--primitive-spacing-3)] text-center",children:"Right-click on the file"})]})})}};var b,h,x;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    trigger: 'contextmenu',
    children: <div className="w-64 h-32 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex items-center justify-center text-body-md text-[var(--color-text-muted)] border-2 border-dashed border-[var(--color-border-default)]">
        Right-click here
      </div>
  }
}`,...(x=(h=t.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var k,C,f;r.parameters={...r.parameters,docs:{...(k=r.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'Click Trigger',
  args: {
    items: basicItems,
    trigger: 'click',
    children: <Button variant="secondary">Click for menu</Button>
  }
}`,...(f=(C=r.parameters)==null?void 0:C.docs)==null?void 0:f.source}}};var y,I,j;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'With Icons',
  args: {
    items: itemsWithIcons,
    trigger: 'click',
    children: <Button variant="secondary">Menu with icons</Button>
  }
}`,...(j=(I=a.parameters)==null?void 0:I.docs)==null?void 0:j.source}}};var N,w,D;s.parameters={...s.parameters,docs:{...(N=s.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'With Dividers',
  args: {
    items: itemsWithDividers,
    trigger: 'click',
    children: <Button variant="secondary">Menu with dividers</Button>
  }
}`,...(D=(w=s.parameters)==null?void 0:w.docs)==null?void 0:D.source}}};var M,W,S;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'With Submenu',
  args: {
    items: itemsWithSubmenu,
    trigger: 'click',
    children: <Button variant="secondary">Menu with submenu</Button>
  }
}`,...(S=(W=o.parameters)==null?void 0:W.docs)==null?void 0:S.source}}};var T,B,E;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'With Disabled Items',
  args: {
    items: itemsWithDisabled,
    trigger: 'click',
    children: <Button variant="secondary">Menu with disabled items</Button>
  }
}`,...(E=(B=l.parameters)==null?void 0:B.docs)==null?void 0:E.source}}};var R,z,F;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'With Tooltips',
  args: {
    items: itemsWithTooltips,
    trigger: 'click',
    children: <Button variant="secondary">Menu with tooltips</Button>
  }
}`,...(F=(z=c.parameters)==null?void 0:z.docs)==null?void 0:F.source}}};var P,A,O;n.parameters={...n.parameters,docs:{...(P=n.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Right Aligned',
  args: {
    items: basicItems,
    trigger: 'click',
    align: 'right',
    children: <Button variant="secondary">Right-aligned menu</Button>
  }
}`,...(O=(A=n.parameters)==null?void 0:A.docs)==null?void 0:O.source}}};var V,G,U;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    trigger: 'click',
    disabled: true,
    children: <Button variant="secondary" disabled>
        Disabled menu
      </Button>
  }
}`,...(U=(G=d.parameters)==null?void 0:G.docs)==null?void 0:U.source}}};var _,q,H;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
    return <div className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] overflow-hidden w-96">
        <table className="w-full text-body-md">
          <thead className="bg-[var(--color-surface-subtle)]">
            <tr>
              <th className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left">
                Name
              </th>
              <th className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left">
                Status
              </th>
              <th className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] w-10"></th>
            </tr>
          </thead>
          <tbody>
            {['Item 1', 'Item 2', 'Item 3'].map((item, i) => <tr key={i} className="border-t hover:bg-[var(--color-surface-subtle)]">
                <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
                  {item}
                </td>
                <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
                  Active
                </td>
                <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
                  <ContextMenu items={rowMenuItems} trigger="click" align="right">
                    <button className="p-[var(--primitive-spacing-1)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)]">
                      ⋮
                    </button>
                  </ContextMenu>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>;
  }
}`,...(H=(q=m.parameters)==null?void 0:q.docs)==null?void 0:H.source}}};var J,K,L;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
        <div className="w-80 p-[var(--primitive-spacing-4)] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
          <div className="flex items-center gap-[var(--primitive-spacing-3)] p-[var(--primitive-spacing-3)] bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-md)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)] cursor-default">
            <IconFile size={24} className="text-[var(--color-state-info)]" />
            <div>
              <p className="text-label-md text-[var(--color-text-default)]">document.pdf</p>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                2.4 MB • Modified today
              </p>
            </div>
          </div>
          <p className="text-body-sm text-[var(--color-text-subtle)] mt-[var(--primitive-spacing-3)] text-center">
            Right-click on the file
          </p>
        </div>
      </ContextMenu>;
  }
}`,...(L=(K=p.parameters)==null?void 0:K.docs)==null?void 0:L.source}}};const Me=["Default","ClickTrigger","WithIcons","WithDividers","WithSubmenu","WithDisabledItems","WithTooltips","RightAligned","Disabled","TableRowMenu","FileExplorerMenu"];export{r as ClickTrigger,t as Default,d as Disabled,p as FileExplorerMenu,n as RightAligned,m as TableRowMenu,l as WithDisabledItems,s as WithDividers,a as WithIcons,o as WithSubmenu,c as WithTooltips,Me as __namedExportsOrder,De as default};
