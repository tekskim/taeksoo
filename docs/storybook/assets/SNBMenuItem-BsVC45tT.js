import{r as h,j as i,R as t}from"./iframe-CzLct1Ct.js";function b({status:u,type:s="icon",icon:e,text:c,iconSize:N=22,onClick:d,className:m="",isSelected:f=!1,children:n}){const[p,o]=h.useState(!1),a=u||(f?"selected":p?"hover":"default"),v={default:"bg-[var(--color-surface-default)]",hover:"bg-[var(--color-surface-subtle)]",selected:"bg-[var(--color-info-weak-bg)]"},l={default:"text-[var(--color-text-muted)]",hover:"text-[var(--color-text-default)]",selected:"text-[var(--color-action-primary)]"},x={default:"text-[var(--color-text-muted)]",hover:"text-[var(--color-text-default)]",selected:"text-[var(--color-action-primary)]"},y=`
    flex flex-col gap-0.5 items-center justify-center
    px-2 py-1.5
    rounded-lg
    size-[38px]
    transition-colors
    cursor-pointer
  `,g=()=>n?t.Children.map(n,r=>t.isValidElement(r)?t.cloneElement(r,{className:`${r.props.className||""} ${l[a]}`.trim()}):r):e?t.isValidElement(e)?t.cloneElement(e,{className:`${e.props.className||""} ${l[a]}`.trim()}):e:null;return i.jsxs("button",{className:`${y} ${v[a]} ${m}`,onClick:d,onMouseEnter:()=>o(!0),onMouseLeave:()=>o(!1),children:[s==="icon"&&g(),s==="text"&&i.jsx("span",{className:`text-heading-h4 ${x[a]}`,children:c})]})}b.__docgenInfo={description:`SNBMenuItem - Side Navigation Bar Menu Item

A menu item component for the narrow side navigation bar.
Supports default, hover, and selected states with appropriate styling.

Design tokens used:
- default: bg-surface-default, icon: text-muted
- hover: bg-surface-subtle, icon: text-default
- selected: bg-info-weak-bg, icon: primary`,methods:[],displayName:"SNBMenuItem",props:{status:{required:!1,tsType:{name:"union",raw:"'default' | 'hover' | 'selected'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'hover'"},{name:"literal",value:"'selected'"}]},description:"Status of the menu item"},type:{required:!1,tsType:{name:"union",raw:"'icon' | 'text'",elements:[{name:"literal",value:"'icon'"},{name:"literal",value:"'text'"}]},description:"Type of menu item (icon or text)",defaultValue:{value:"'icon'",computed:!1}},icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:'Icon element (for type="icon")'},text:{required:!1,tsType:{name:"string"},description:'Text content (for type="text")'},iconSize:{required:!1,tsType:{name:"number"},description:"Size of the icon (default: 22)",defaultValue:{value:"22",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Click handler"},className:{required:!1,tsType:{name:"string"},description:"Additional class name",defaultValue:{value:"''",computed:!1}},isSelected:{required:!1,tsType:{name:"boolean"},description:'Whether the item is selected (alternative to status="selected")',defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Children (alternative to icon prop)"}}};export{b as S};
