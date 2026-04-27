import{r as l,j as e}from"./iframe-DD6jyF7N.js";import{D as y}from"./DatePicker-Au-pYneR.js";const D=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],m=t=>{if(!t)return"";const a=D[t.getMonth()],r=t.getDate().toString().padStart(2,"0"),i=t.getFullYear();return`${a} ${r}, ${i}`},k=({value:t,onChange:a,onApply:r,onCancel:i,minDate:p,maxDate:x,className:b=""})=>{const[n,g]=l.useState((t==null?void 0:t.start)??null),[s,f]=l.useState((t==null?void 0:t.end)??null),[d,u]=l.useState(!0),v=l.useCallback(o=>{g(o.start),f(o.end),u(!o.start||!!o.end),a==null||a(o)},[a]),h=l.useCallback(()=>{n&&s&&(r==null||r({start:n,end:s}))},[n,s,r]),c=n!==null&&s!==null;return e.jsxs("div",{className:`
        inline-flex flex-col gap-[var(--datepicker-gap)]
        p-[var(--datepicker-padding)]
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-default)]
        rounded-[var(--datepicker-radius)]
        w-fit
        ${b}
      `,children:[e.jsxs("div",{className:"flex items-center",children:[e.jsxs("button",{type:"button",className:`
            flex-1 flex flex-col
            py-[10px] px-[14px]
            rounded-[var(--radius-md)]
            border-none cursor-pointer
            transition-all duration-[var(--duration-fast)]
            ${d?"bg-[var(--color-action-primary-subtle)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]":"bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]"}
          `,onClick:()=>u(!0),children:[e.jsx("span",{className:"text-[10px] font-medium uppercase tracking-[0.3px] text-[var(--color-text-subtle)] mb-0.5",children:"START"}),e.jsx("span",{className:"text-[13px] font-semibold leading-[18px] min-h-[18px] text-[var(--color-text-default)]",children:m(n)})]}),e.jsx("div",{className:"px-2 text-[12px] text-[var(--color-text-subtle)]",children:"~"}),e.jsxs("button",{type:"button",className:`
            flex-1 flex flex-col
            py-[10px] px-[14px]
            rounded-[var(--radius-md)]
            border-none cursor-pointer
            transition-all duration-[var(--duration-fast)]
            ${d?"bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]":"bg-[var(--color-action-primary-subtle)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]"}
          `,onClick:()=>u(!1),children:[e.jsx("span",{className:"text-[10px] font-medium uppercase tracking-[0.3px] text-[var(--color-text-subtle)] mb-0.5",children:"END"}),e.jsx("span",{className:"text-[13px] font-semibold leading-[18px] min-h-[18px] text-[var(--color-text-default)]",children:m(s)})]})]}),e.jsx(y,{mode:"range",rangeValue:{start:n,end:s},onRangeChange:v,minDate:p,maxDate:x,className:"!border-0 !p-0"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{type:"button",className:`
            flex-1
            h-[var(--button-height-sm)]
            text-[length:var(--button-font-size-sm)]
            leading-[var(--button-line-height-sm)]
            font-medium
            text-[var(--color-text-default)]
            bg-[var(--color-surface-default)]
            border border-[var(--color-border-strong)]
            rounded-[var(--button-radius)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--button-secondary-hover-bg)]
          `,onClick:i,children:"Cancel"}),e.jsx("button",{type:"button",className:`
            flex-1
            h-[var(--button-height-sm)]
            text-[length:var(--button-font-size-sm)]
            leading-[var(--button-line-height-sm)]
            font-medium
            text-[var(--color-text-on-primary)]
            bg-[var(--color-action-primary)]
            rounded-[var(--button-radius)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--color-action-primary-hover)]
            ${c?"":"opacity-50 cursor-not-allowed"}
          `,disabled:!c,onClick:h,children:"Apply"})]})]})};k.__docgenInfo={description:"",methods:[],displayName:"DateRangePicker",props:{value:{required:!1,tsType:{name:"signature",type:"object",raw:"{ start: Date | null; end: Date | null }",signature:{properties:[{key:"start",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}},{key:"end",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}}]}},description:"Selected date range"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(range: { start: Date | null; end: Date | null }) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ start: Date | null; end: Date | null }",signature:{properties:[{key:"start",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}},{key:"end",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}}]}},name:"range"}],return:{name:"void"}}},description:"Callback on each selection step"},onApply:{required:!1,tsType:{name:"signature",type:"function",raw:"(range: { start: Date; end: Date }) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ start: Date; end: Date }",signature:{properties:[{key:"start",value:{name:"Date",required:!0}},{key:"end",value:{name:"Date",required:!0}}]}},name:"range"}],return:{name:"void"}}},description:"Callback when Apply is clicked (both dates guaranteed non-null)"},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when Cancel is clicked"},minDate:{required:!1,tsType:{name:"Date"},description:"Minimum selectable date"},maxDate:{required:!1,tsType:{name:"Date"},description:"Maximum selectable date"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};export{k as D};
