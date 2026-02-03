import{r as f,j as l}from"./iframe-DF19JO67.js";import{I as O}from"./IconChevronLeft-C3ZLurxJ.js";import{I as K}from"./IconChevronRight-_oIFrOM0.js";const B=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],U=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],o=(i,t)=>i.getFullYear()===t.getFullYear()&&i.getMonth()===t.getMonth()&&i.getDate()===t.getDate(),E=(i,t,a)=>{if(!t||!a)return!1;const s=i.getTime();return s>t.getTime()&&s<a.getTime()},R=(i,t,a)=>!!(t&&i<t||a&&i>a),A=(i,t)=>new Date(i,t+1,0).getDate(),G=(i,t)=>new Date(i,t,1).getDay(),H=(i,t,a,s,c,g,b,y=0)=>{const u=[],v=new Date,T=A(i,t);let x=G(i,t);y===1&&(x=x===0?6:x-1);const M=t===0?11:t-1,j=t===0?i-1:i,I=A(j,M);for(let r=x-1;r>=0;r--){const n=I-r,d=new Date(j,M,n);u.push({date:d,day:n,isCurrentMonth:!1,isToday:o(d,v),isSelected:a?o(d,a):!1,isRangeStart:s.start?o(d,s.start):!1,isRangeEnd:s.end?o(d,s.end):!1,isInRange:E(d,s.start,s.end),hasEvent:c.some(S=>o(S,d)),isDisabled:R(d,g,b)})}for(let r=1;r<=T;r++){const n=new Date(i,t,r);u.push({date:n,day:r,isCurrentMonth:!0,isToday:o(n,v),isSelected:a?o(n,a):!1,isRangeStart:s.start?o(n,s.start):!1,isRangeEnd:s.end?o(n,s.end):!1,isInRange:E(n,s.start,s.end),hasEvent:c.some(d=>o(d,n)),isDisabled:R(n,g,b)})}const w=t===11?0:t+1,m=t===11?i+1:i,k=42-u.length;for(let r=1;r<=k;r++){const n=new Date(m,w,r);u.push({date:n,day:r,isCurrentMonth:!1,isToday:o(n,v),isSelected:a?o(n,a):!1,isRangeStart:s.start?o(n,s.start):!1,isRangeEnd:s.end?o(n,s.end):!1,isInRange:E(n,s.start,s.end),hasEvent:c.some(d=>o(d,n)),isDisabled:R(n,g,b)})}return u},J=({mode:i="single",value:t=null,rangeValue:a={start:null,end:null},onChange:s,onRangeChange:c,eventDates:g=[],minDate:b,maxDate:y,disabled:u=!1,firstDayOfWeek:v=0,className:T="",onApply:x,onCancel:M,numberOfMonths:j,isLoading:I})=>{const w=t||a.start||new Date,[m,k]=f.useState(w.getFullYear()),[r,n]=f.useState(w.getMonth()),[d,S]=f.useState(!1),F=v===1?U:B,C=f.useMemo(()=>H(m,r,t,a,g,b,y,v),[m,r,t,a,g,b,y,v]),L=f.useCallback(()=>{r===0?(k(m-1),n(11)):n(r-1)},[r,m]),$=f.useCallback(()=>{r===11?(k(m+1),n(0)):n(r+1)},[r,m]),P=f.useCallback(e=>{u||e.isDisabled||(i==="single"?s==null||s(e.date):!d||!a.start?(c==null||c({start:e.date,end:null}),S(!0)):(e.date<a.start?c==null||c({start:e.date,end:a.start}):c==null||c({start:a.start,end:e.date}),S(!1)))},[u,i,s,c,a.start,d]),z=f.useMemo(()=>{const e=m,p=String(r+1).padStart(2,"0");return`${e}.${p}`},[m,r]),_=7*32+6*6+2*12;return l.jsxs("div",{className:`
        inline-flex flex-col gap-[var(--datepicker-gap)]
        p-[var(--datepicker-padding)]
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-default)]
        rounded-[var(--datepicker-radius)]
        ${u?"opacity-50 pointer-events-none":""}
        ${T}
      `,style:{width:_},children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("button",{type:"button",onClick:L,disabled:u,className:`
            flex items-center justify-center
            w-6 h-6
            text-[var(--color-text-default)]
            hover:bg-[var(--datepicker-hover-bg)]
            rounded-[var(--radius-button)]
            transition-colors duration-[var(--duration-fast)]
          `,"aria-label":"Previous month",children:l.jsx(O,{size:16,stroke:1})}),l.jsx("span",{className:`
          w-[64px]
          text-heading-h5
          text-[var(--color-text-default)]
          text-left
          select-none
        `,children:z}),l.jsx("button",{type:"button",onClick:$,disabled:u,className:`
            flex items-center justify-center
            w-6 h-6
            text-[var(--color-text-default)]
            hover:bg-[var(--datepicker-hover-bg)]
            rounded-[var(--radius-button)]
            transition-colors duration-[var(--duration-fast)]
          `,"aria-label":"Next month",children:l.jsx(K,{size:16,stroke:1})})]}),l.jsxs("div",{className:"flex flex-col gap-[var(--datepicker-row-gap)]",children:[l.jsx("div",{className:"grid grid-cols-7",children:F.map((e,p)=>{const h=p===0,D=p===6;return l.jsx("div",{className:`
                  w-[var(--datepicker-cell-size)]
                  px-2 py-0.5
                  text-label-sm
                  text-[var(--color-text-muted)]
                  text-center
                  select-none
                `,style:{paddingLeft:h?8:11,paddingRight:D?8:11},children:e},e)})}),l.jsx("div",{className:"grid grid-cols-7",children:C.map((e,p)=>{const h=e.isSelected||e.isRangeStart||e.isRangeEnd,D=a.start&&a.end,W=D&&(e.isInRange||e.isRangeStart||e.isRangeEnd),Y=p%7,N=Y===0,q=Y===6;return l.jsxs("div",{className:"relative",style:{paddingLeft:N?0:3,paddingRight:q?0:3,marginBottom:p<35?6:0},children:[D&&W&&!e.isRangeStart&&!e.isRangeEnd&&l.jsx("div",{className:"absolute bg-[var(--datepicker-range-bg)]",style:{top:0,bottom:0,left:N?0:-3,right:q?0:-3}}),D&&e.isRangeStart&&!o(a.start,a.end)&&l.jsx("div",{className:"absolute bg-[var(--datepicker-range-bg)]",style:{top:0,bottom:0,left:16,right:q?0:-3}}),D&&e.isRangeEnd&&!o(a.start,a.end)&&l.jsx("div",{className:"absolute bg-[var(--datepicker-range-bg)]",style:{top:0,bottom:0,left:N?0:-3,right:16}}),l.jsxs("button",{type:"button",onClick:()=>P(e),disabled:u||e.isDisabled,className:`
                    relative z-10
                    flex flex-col items-center justify-center
                    w-[var(--datepicker-cell-size)]
                    h-[var(--datepicker-cell-size)]
                    p-2
                    text-label-md
                    rounded-full
                    transition-colors duration-[var(--duration-fast)]
                    ${h?"bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)]":e.isCurrentMonth?"text-[var(--color-text-default)] hover:bg-[var(--datepicker-hover-bg)]":"text-[var(--color-text-muted)] hover:bg-[var(--datepicker-hover-bg)]"}
                    ${e.isDisabled?"opacity-50 cursor-not-allowed":"cursor-pointer"}
                    ${e.isToday&&!h?"ring-1 ring-[var(--color-action-primary)]":""}
                  `,"aria-label":e.date.toLocaleDateString(),"aria-selected":h,children:[e.day,e.hasEvent&&l.jsx("span",{className:`
                        absolute bottom-1
                        w-1 h-1
                        rounded-full
                        ${h?"bg-[var(--color-text-on-primary)]":"bg-[var(--color-action-primary)]"}
                      `})]})]},p)})})]})]})};J.__docgenInfo={description:"",methods:[],displayName:"DatePicker",props:{mode:{required:!1,tsType:{name:"union",raw:"'single' | 'range'",elements:[{name:"literal",value:"'single'"},{name:"literal",value:"'range'"}]},description:"Selection mode",defaultValue:{value:"'single'",computed:!1}},value:{required:!1,tsType:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}]},description:"Selected date (single mode)",defaultValue:{value:"null",computed:!1}},rangeValue:{required:!1,tsType:{name:"signature",type:"object",raw:"{ start: Date | null; end: Date | null }",signature:{properties:[{key:"start",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}},{key:"end",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}}]}},description:"Selected range (range mode)",defaultValue:{value:"{ start: null, end: null }",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(date: Date | null) => void",signature:{arguments:[{type:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}]},name:"date"}],return:{name:"void"}}},description:"Callback when date changes (single mode)"},onRangeChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(range: { start: Date | null; end: Date | null }) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ start: Date | null; end: Date | null }",signature:{properties:[{key:"start",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}},{key:"end",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}}]}},name:"range"}],return:{name:"void"}}},description:"Callback when range changes (range mode)"},eventDates:{required:!1,tsType:{name:"Array",elements:[{name:"Date"}],raw:"Date[]"},description:"Dates with events (shows dot indicator)",defaultValue:{value:"[]",computed:!1}},minDate:{required:!1,tsType:{name:"Date"},description:"Minimum selectable date"},maxDate:{required:!1,tsType:{name:"Date"},description:"Maximum selectable date"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},firstDayOfWeek:{required:!1,tsType:{name:"union",raw:"0 | 1",elements:[{name:"literal",value:"0"},{name:"literal",value:"1"}]},description:"First day of week (0 = Sunday, 1 = Monday)",defaultValue:{value:"0",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}},onApply:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: ThakiDatePickerValue) => void",signature:{arguments:[{type:{name:"ThakiDatePickerValue"},name:"value"}],return:{name:"void"}}},description:"@deprecated thaki-ui compatibility - use onChange/onRangeChange instead"},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"@deprecated thaki-ui compatibility - cancel handler"},numberOfMonths:{required:!1,tsType:{name:"number"},description:"@deprecated thaki-ui compatibility - number of visible months"},isLoading:{required:!1,tsType:{name:"boolean"},description:"@deprecated thaki-ui compatibility - loading state"}}};export{J as D};
