import{r as v,j as i}from"./iframe-D96dQDLz.js";import{I as _}from"./IconChevronLeft-FoX3rPSJ.js";import{I as P}from"./IconChevronRight-DfXvK1WI.js";const C=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],W=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],l=(n,t)=>n.getFullYear()===t.getFullYear()&&n.getMonth()===t.getMonth()&&n.getDate()===t.getDate(),I=(n,t,s)=>{if(!t||!s)return!1;const a=n.getTime();return a>t.getTime()&&a<s.getTime()},R=(n,t,s)=>!!(t&&n<t||s&&n>s),z=(n,t)=>new Date(n,t+1,0).getDate(),K=(n,t)=>new Date(n,t,1).getDay(),B=(n,t,s,a,d,b,x,k=0)=>{const u=[],g=new Date,j=z(n,t);let h=K(n,t);k===1&&(h=h===0?6:h-1);const p=t===0?11:t-1,S=t===0?n-1:n,m=z(S,p);for(let o=h-1;o>=0;o--){const r=m-o,c=new Date(S,p,r);u.push({date:c,day:r,isCurrentMonth:!1,isToday:l(c,g),isSelected:s?l(c,s):!1,isRangeStart:a.start?l(c,a.start):!1,isRangeEnd:a.end?l(c,a.end):!1,isInRange:I(c,a.start,a.end),hasEvent:d.some(N=>l(N,c)),isDisabled:R(c,b,x)})}for(let o=1;o<=j;o++){const r=new Date(n,t,o);u.push({date:r,day:o,isCurrentMonth:!0,isToday:l(r,g),isSelected:s?l(r,s):!1,isRangeStart:a.start?l(r,a.start):!1,isRangeEnd:a.end?l(r,a.end):!1,isInRange:I(r,a.start,a.end),hasEvent:d.some(c=>l(c,r)),isDisabled:R(r,b,x)})}const D=t===11?0:t+1,T=t===11?n+1:n,M=42-u.length;for(let o=1;o<=M;o++){const r=new Date(T,D,o);u.push({date:r,day:o,isCurrentMonth:!1,isToday:l(r,g),isSelected:s?l(r,s):!1,isRangeStart:a.start?l(r,a.start):!1,isRangeEnd:a.end?l(r,a.end):!1,isInRange:I(r,a.start,a.end),hasEvent:d.some(c=>l(c,r)),isDisabled:R(r,b,x)})}return u},O=({mode:n="single",value:t=null,rangeValue:s={start:null,end:null},onChange:a,onRangeChange:d,eventDates:b=[],minDate:x,maxDate:k,disabled:u=!1,firstDayOfWeek:g=0,className:j=""})=>{const h=t||s.start||new Date,[p,S]=v.useState(h.getFullYear()),[m,D]=v.useState(h.getMonth()),[T,M]=v.useState(!1),o=g===1?W:C,r=v.useMemo(()=>B(p,m,t,s,b,x,k,g),[p,m,t,s,b,x,k,g]),c=v.useCallback(()=>{m===0?(S(p-1),D(11)):D(m-1)},[m,p]),N=v.useCallback(()=>{m===11?(S(p+1),D(0)):D(m+1)},[m,p]),F=v.useCallback(e=>{u||e.isDisabled||(n==="single"?a==null||a(e.date):!T||!s.start?(d==null||d({start:e.date,end:null}),M(!0)):(e.date<s.start?d==null||d({start:e.date,end:s.start}):d==null||d({start:s.start,end:e.date}),M(!1)))},[u,n,a,d,s.start,T]),$=v.useMemo(()=>{const e=p,f=String(m+1).padStart(2,"0");return`${e}.${f}`},[p,m]),A=7*32+6*6+2*12;return i.jsxs("div",{className:`
        inline-flex flex-col gap-[var(--datepicker-gap)]
        p-[var(--datepicker-padding)]
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-default)]
        rounded-[var(--datepicker-radius)]
        ${u?"opacity-50 pointer-events-none":""}
        ${j}
      `,style:{width:A},children:[i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx("button",{type:"button",onClick:c,disabled:u,className:`
            flex items-center justify-center
            w-6 h-6
            text-[var(--color-text-default)]
            hover:bg-[var(--datepicker-hover-bg)]
            rounded-[var(--radius-button)]
            transition-colors duration-[var(--duration-fast)]
          `,"aria-label":"Previous month",children:i.jsx(_,{size:16,stroke:1})}),i.jsx("span",{className:`
          w-[64px]
          text-[length:var(--font-size-16)]
          leading-[var(--line-height-24)]
          font-semibold
          text-[var(--color-text-default)]
          text-left
          select-none
        `,children:$}),i.jsx("button",{type:"button",onClick:N,disabled:u,className:`
            flex items-center justify-center
            w-6 h-6
            text-[var(--color-text-default)]
            hover:bg-[var(--datepicker-hover-bg)]
            rounded-[var(--radius-button)]
            transition-colors duration-[var(--duration-fast)]
          `,"aria-label":"Next month",children:i.jsx(P,{size:16,stroke:1})})]}),i.jsxs("div",{className:"flex flex-col gap-[var(--datepicker-row-gap)]",children:[i.jsx("div",{className:"grid grid-cols-7",children:o.map((e,f)=>{const w=f===0,y=f===6;return i.jsx("div",{className:`
                  w-[var(--datepicker-cell-size)]
                  px-2 py-0.5
                  text-[length:var(--font-size-11)]
                  leading-[var(--line-height-16)]
                  font-medium
                  text-[var(--color-text-muted)]
                  text-center
                  select-none
                `,style:{paddingLeft:w?8:11,paddingRight:y?8:11},children:e},e)})}),i.jsx("div",{className:"grid grid-cols-7",children:r.map((e,f)=>{const w=e.isSelected||e.isRangeStart||e.isRangeEnd,y=s.start&&s.end,L=y&&(e.isInRange||e.isRangeStart||e.isRangeEnd),Y=f%7,E=Y===0,q=Y===6;return i.jsxs("div",{className:"relative",style:{paddingLeft:E?0:3,paddingRight:q?0:3,marginBottom:f<35?6:0},children:[y&&L&&!e.isRangeStart&&!e.isRangeEnd&&i.jsx("div",{className:"absolute bg-[var(--datepicker-range-bg)]",style:{top:0,bottom:0,left:E?0:-3,right:q?0:-3}}),y&&e.isRangeStart&&!l(s.start,s.end)&&i.jsx("div",{className:"absolute bg-[var(--datepicker-range-bg)]",style:{top:0,bottom:0,left:16,right:q?0:-3}}),y&&e.isRangeEnd&&!l(s.start,s.end)&&i.jsx("div",{className:"absolute bg-[var(--datepicker-range-bg)]",style:{top:0,bottom:0,left:E?0:-3,right:16}}),i.jsxs("button",{type:"button",onClick:()=>F(e),disabled:u||e.isDisabled,className:`
                    relative z-10
                    flex flex-col items-center justify-center
                    w-[var(--datepicker-cell-size)]
                    h-[var(--datepicker-cell-size)]
                    p-2
                    text-[length:var(--font-size-12)]
                    leading-[var(--line-height-16)]
                    font-medium
                    rounded-full
                    transition-colors duration-[var(--duration-fast)]
                    ${w?"bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)]":e.isCurrentMonth?"text-[var(--color-text-default)] hover:bg-[var(--datepicker-hover-bg)]":"text-[var(--color-text-muted)] hover:bg-[var(--datepicker-hover-bg)]"}
                    ${e.isDisabled?"opacity-50 cursor-not-allowed":"cursor-pointer"}
                    ${e.isToday&&!w?"ring-1 ring-[var(--color-action-primary)]":""}
                  `,"aria-label":e.date.toLocaleDateString(),"aria-selected":w,children:[e.day,e.hasEvent&&i.jsx("span",{className:`
                        absolute bottom-1
                        w-1 h-1
                        rounded-full
                        ${w?"bg-[var(--color-text-on-primary)]":"bg-[var(--color-action-primary)]"}
                      `})]})]},f)})})]})]})};O.__docgenInfo={description:"",methods:[],displayName:"DatePicker",props:{mode:{required:!1,tsType:{name:"union",raw:"'single' | 'range'",elements:[{name:"literal",value:"'single'"},{name:"literal",value:"'range'"}]},description:"Selection mode",defaultValue:{value:"'single'",computed:!1}},value:{required:!1,tsType:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}]},description:"Selected date (single mode)",defaultValue:{value:"null",computed:!1}},rangeValue:{required:!1,tsType:{name:"signature",type:"object",raw:"{ start: Date | null; end: Date | null }",signature:{properties:[{key:"start",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}},{key:"end",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}}]}},description:"Selected range (range mode)",defaultValue:{value:"{ start: null, end: null }",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(date: Date | null) => void",signature:{arguments:[{type:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}]},name:"date"}],return:{name:"void"}}},description:"Callback when date changes (single mode)"},onRangeChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(range: { start: Date | null; end: Date | null }) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ start: Date | null; end: Date | null }",signature:{properties:[{key:"start",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}},{key:"end",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!0}}]}},name:"range"}],return:{name:"void"}}},description:"Callback when range changes (range mode)"},eventDates:{required:!1,tsType:{name:"Array",elements:[{name:"Date"}],raw:"Date[]"},description:"Dates with events (shows dot indicator)",defaultValue:{value:"[]",computed:!1}},minDate:{required:!1,tsType:{name:"Date"},description:"Minimum selectable date"},maxDate:{required:!1,tsType:{name:"Date"},description:"Maximum selectable date"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},firstDayOfWeek:{required:!1,tsType:{name:"union",raw:"0 | 1",elements:[{name:"literal",value:"0"},{name:"literal",value:"1"}]},description:"First day of week (0 = Sunday, 1 = Monday)",defaultValue:{value:"0",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};export{O as D};
