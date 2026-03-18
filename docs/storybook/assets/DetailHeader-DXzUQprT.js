import{j as r,r as g}from"./iframe-BkR05wRD.js";import{t as n}from"./cn-8AORBNJN.js";import{I as D}from"./InfoBox-BFQKuHQD.js";function i({children:e,className:t,...a}){return r.jsx("div",{"data-figma-name":"[TDS] DetailPageHeader",className:n("bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","rounded-lg","px-4 pt-3 pb-4","w-full",t),...a,children:e})}function p({children:e,className:t,...a}){return r.jsx("h5",{"data-figma-name":"[TDS] DetailPageHeader/Title",className:n("text-heading-h5","text-[var(--color-text-default)]","mb-3",t),...a,children:e})}function c({children:e,className:t,...a}){return r.jsx("div",{"data-figma-name":"[TDS] DetailPageHeader/Actions",className:n("flex items-center gap-1","mb-3",t),...a,children:e})}function b(e){if(e<=4)return[e];if(e===5)return[3,2];if(e===6)return[4,2];if(e===7)return[4,3];if(e===8)return[4,4];if(e===9)return[4,3,2];if(e===10)return[4,4,2];if(e===11)return[4,4,3];if(e===12)return[4,4,4];const t=[];let a=e;for(;a>0;)t.push(Math.min(4,a)),a-=Math.min(4,a);return t}function f({children:e,className:t,...a}){const l=g.Children.toArray(e),d=l.length,o=b(d);if(o.length===1)return r.jsx("div",{"data-figma-name":"[TDS] DetailPageHeader/InfoGrid",className:n("flex items-stretch gap-3","w-full",t),...a,children:e});let m=0;const h=o.map(s=>{const u=l.slice(m,m+s);return m+=s,u});return r.jsx("div",{"data-figma-name":"[TDS] DetailPageHeader/InfoGrid",className:n("flex flex-col gap-3","w-full",t),...a,children:h.map((s,u)=>r.jsx("div",{className:"flex items-stretch gap-3 w-full",children:s},u))})}function v({label:e,value:t,copyable:a=!1,status:l,tooltip:d,className:o}){return r.jsx(D,{label:e,value:t,tooltip:d,copyable:a,status:l,className:n("flex-1",o)})}i.Title=p;i.Actions=c;i.InfoGrid=f;i.InfoCard=v;i.__docgenInfo={description:"",methods:[{name:"Title",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DetailHeaderTitleProps",optional:!1,type:{name:"DetailHeaderTitleProps",alias:"DetailHeaderTitleProps"}}],returns:null},{name:"Actions",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DetailHeaderActionsProps",optional:!1,type:{name:"DetailHeaderActionsProps",alias:"DetailHeaderActionsProps"}}],returns:null},{name:"InfoGrid",docblock:null,modifiers:["static"],params:[{name:"{ children, className, ...props }: DetailHeaderInfoGridProps",optional:!1,type:{name:"DetailHeaderInfoGridProps",alias:"DetailHeaderInfoGridProps"}}],returns:null},{name:"InfoCard",docblock:null,modifiers:["static"],params:[{name:`{
  label,
  value,
  copyable = false,
  status,
  tooltip,
  className,
}: DetailHeaderInfoCardProps`,optional:!1,type:{name:"DetailHeaderInfoCardProps",alias:"DetailHeaderInfoCardProps"}}],returns:null}],displayName:"DetailHeader",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Child components"}},composes:["HTMLAttributes"]};p.__docgenInfo={description:"",methods:[],displayName:"DetailHeaderTitle",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Title text or children"}},composes:["HTMLAttributes"]};c.__docgenInfo={description:"",methods:[],displayName:"DetailHeaderActions",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"Action buttons"}},composes:["HTMLAttributes"]};f.__docgenInfo={description:"",methods:[],displayName:"DetailHeaderInfoGrid",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"InfoCard components"}},composes:["HTMLAttributes"]};v.__docgenInfo={description:"",methods:[],displayName:"DetailHeaderInfoCard",props:{label:{required:!0,tsType:{name:"string"},description:"Label for the info card"},value:{required:!0,tsType:{name:"ReactNode"},description:"Value to display - can be string or ReactNode"},copyable:{required:!1,tsType:{name:"boolean"},description:"Show copy button for the value (only works with string values)",defaultValue:{value:"false",computed:!1}},status:{required:!1,tsType:{name:"union",raw:`| 'active'
| 'enabled'
| 'error'
| 'building'
| 'deleting'
| 'suspended'
| 'shelved'
| 'shelved-offloaded'
| 'mounted'
| 'shutoff'
| 'paused'
| 'pending'
| 'draft'
| 'verify-resized'
| 'deactivated'
| 'disabled'
| 'in-use'
| 'maintenance'
| 'degraded'
| 'no-monitor'
| 'down'`,elements:[{name:"literal",value:"'active'"},{name:"literal",value:"'enabled'"},{name:"literal",value:"'error'"},{name:"literal",value:"'building'"},{name:"literal",value:"'deleting'"},{name:"literal",value:"'suspended'"},{name:"literal",value:"'shelved'"},{name:"literal",value:"'shelved-offloaded'"},{name:"literal",value:"'mounted'"},{name:"literal",value:"'shutoff'"},{name:"literal",value:"'paused'"},{name:"literal",value:"'pending'"},{name:"literal",value:"'draft'"},{name:"literal",value:"'verify-resized'"},{name:"literal",value:"'deactivated'"},{name:"literal",value:"'disabled'"},{name:"literal",value:"'in-use'"},{name:"literal",value:"'maintenance'"},{name:"literal",value:"'degraded'"},{name:"literal",value:"'no-monitor'"},{name:"literal",value:"'down'"}]},description:"Show status indicator instead of value"},tooltip:{required:!1,tsType:{name:"string"},description:"Tooltip text for help icon next to label"}},composes:["Omit"]};export{i as D};
