import{r as o,j as t}from"./iframe-CzLct1Ct.js";import{D as r}from"./DatePicker-BcGAGAcq.js";import"./preload-helper-C1FmrZbK.js";import"./IconChevronLeft-BnrUDSxQ.js";import"./createReactComponent-Djx9unWR.js";import"./IconChevronRight-CGyay9dN.js";const ue={title:"Components/DatePicker",component:r,parameters:{layout:"centered",docs:{description:{component:"날짜를 선택하는 캘린더 컴포넌트입니다. 단일 날짜 또는 날짜 범위를 선택할 수 있습니다."}}},tags:["autodocs"],argTypes:{mode:{control:"select",options:["single","range"],description:"선택 모드"},disabled:{control:"boolean",description:"비활성화 상태"},firstDayOfWeek:{control:"select",options:[0,1],description:"주 시작일 (0: 일요일, 1: 월요일)"}}},c={args:{mode:"single"}},d={name:"Single Date Selection",render:()=>{const[e,a]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] items-center",children:[t.jsx(r,{mode:"single",value:e,onChange:a}),t.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Selected: ",e?e.toLocaleDateString():"None"]})]})}},i={name:"Date Range Selection",render:()=>{var s,n;const[e,a]=o.useState({start:null,end:null});return t.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] items-center",children:[t.jsx(r,{mode:"range",rangeValue:e,onRangeChange:a}),t.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Range: ",((s=e.start)==null?void 0:s.toLocaleDateString())||"Start"," ~"," ",((n=e.end)==null?void 0:n.toLocaleDateString())||"End"]})]})}},g={name:"With Pre-selected Date",render:()=>{const e=new Date,[a,s]=o.useState(e);return t.jsx(r,{mode:"single",value:a,onChange:s})}},m={name:"With Pre-selected Range",render:()=>{const e=new Date,a=new Date(e);a.setDate(e.getDate()+7);const[s,n]=o.useState({start:e,end:a});return t.jsx(r,{mode:"range",rangeValue:s,onRangeChange:n})}},u={name:"With Event Dates",render:()=>{const e=new Date,a=[new Date(e.getFullYear(),e.getMonth(),5),new Date(e.getFullYear(),e.getMonth(),12),new Date(e.getFullYear(),e.getMonth(),18),new Date(e.getFullYear(),e.getMonth(),25)],[s,n]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] items-center",children:[t.jsx(r,{mode:"single",value:s,onChange:n,eventDates:a}),t.jsx("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"Dates with dots have events"})]})}},D={name:"With Min/Max Dates",render:()=>{const e=new Date,a=new Date(e);a.setDate(e.getDate()-5);const s=new Date(e);s.setDate(e.getDate()+14);const[n,l]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] items-center",children:[t.jsx(r,{mode:"single",value:n,onChange:l,minDate:a,maxDate:s}),t.jsx("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"Only dates within ±2 weeks are selectable"})]})}},p={name:"Monday Start",render:()=>{const[e,a]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] items-center",children:[t.jsx(r,{mode:"single",value:e,onChange:a,firstDayOfWeek:1}),t.jsx("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"Week starts on Monday"})]})}},x={name:"Sunday Start (Default)",render:()=>{const[e,a]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] items-center",children:[t.jsx(r,{mode:"single",value:e,onChange:a,firstDayOfWeek:0}),t.jsx("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"Week starts on Sunday"})]})}},v={args:{mode:"single",disabled:!0}},h={name:"Use Case - Booking Calendar",render:()=>{const e=new Date,a=[new Date(e.getFullYear(),e.getMonth(),8),new Date(e.getFullYear(),e.getMonth(),9),new Date(e.getFullYear(),e.getMonth(),10),new Date(e.getFullYear(),e.getMonth(),15),new Date(e.getFullYear(),e.getMonth(),22),new Date(e.getFullYear(),e.getMonth(),23)],[s,n]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] items-center",children:[t.jsx("h3",{className:"text-label-lg text-[var(--color-text-default)]",children:"Select Check-in Date"}),t.jsx(r,{mode:"single",value:s,onChange:n,eventDates:a,minDate:e}),t.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)] text-body-sm text-[var(--color-text-subtle)]",children:[t.jsxs("span",{className:"flex items-center gap-[var(--primitive-spacing-1)]",children:[t.jsx("span",{className:"w-2 h-2 rounded-full bg-[var(--color-state-info)]"}),"Booked"]}),t.jsxs("span",{className:"flex items-center gap-[var(--primitive-spacing-1)]",children:[t.jsx("span",{className:"w-2 h-2 rounded-full ring-1 ring-[var(--color-border-focus)]"}),"Today"]})]})]})}},y={name:"Use Case - Travel Date Range",render:()=>{const e=new Date,[a,s]=o.useState({start:null,end:null}),n=a.start&&a.end?Math.ceil((a.end.getTime()-a.start.getTime())/(1e3*60*60*24)):0;return t.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] items-center",children:[t.jsx("h3",{className:"text-label-lg text-[var(--color-text-default)]",children:"Select Travel Dates"}),t.jsx(r,{mode:"range",rangeValue:a,onRangeChange:s,minDate:e,firstDayOfWeek:1}),n>0&&t.jsxs("p",{className:"text-label-md text-[var(--color-state-info)]",children:[n," night",n>1?"s":""," selected"]})]})}},f={name:"Use Case - Event Scheduler",render:()=>{const e=new Date,a=[new Date(e.getFullYear(),e.getMonth(),3),new Date(e.getFullYear(),e.getMonth(),7),new Date(e.getFullYear(),e.getMonth(),14),new Date(e.getFullYear(),e.getMonth(),21),new Date(e.getFullYear(),e.getMonth(),28)],[s,n]=o.useState(null),l=s&&a.find(S=>S.getDate()===s.getDate()&&S.getMonth()===s.getMonth());return t.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] items-center",children:[t.jsx("h3",{className:"text-label-lg text-[var(--color-text-default)]",children:"Upcoming Events"}),t.jsx(r,{mode:"single",value:s,onChange:n,eventDates:a}),l?t.jsxs("p",{className:"text-body-md text-[var(--color-state-success)]",children:["Event on ",l.toLocaleDateString()]}):t.jsx("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"Click on a date with a dot to see the event"})]})}};var w,M,N;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    mode: 'single'
  }
}`,...(N=(M=c.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var b,k,j;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'Single Date Selection',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="single" value={date} onChange={setDate} />
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>;
  }
}`,...(j=(k=d.parameters)==null?void 0:k.docs)==null?void 0:j.source}}};var C,W,F;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'Date Range Selection',
  render: () => {
    const [range, setRange] = useState<{
      start: Date | null;
      end: Date | null;
    }>({
      start: null,
      end: null
    });
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />
        <p className="text-body-md text-[var(--color-text-muted)]">
          Range: {range.start?.toLocaleDateString() || 'Start'} ~{' '}
          {range.end?.toLocaleDateString() || 'End'}
        </p>
      </div>;
  }
}`,...(F=(W=i.parameters)==null?void 0:W.docs)==null?void 0:F.source}}};var R,Y,E;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'With Pre-selected Date',
  render: () => {
    const today = new Date();
    const [date, setDate] = useState<Date | null>(today);
    return <DatePicker mode="single" value={date} onChange={setDate} />;
  }
}`,...(E=(Y=g.parameters)==null?void 0:Y.docs)==null?void 0:E.source}}};var P,T,O;m.parameters={...m.parameters,docs:{...(P=m.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'With Pre-selected Range',
  render: () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const [range, setRange] = useState<{
      start: Date | null;
      end: Date | null;
    }>({
      start: today,
      end: nextWeek
    });
    return <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />;
  }
}`,...(O=(T=m.parameters)==null?void 0:T.docs)==null?void 0:O.source}}};var L,U,B;u.parameters={...u.parameters,docs:{...(L=u.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'With Event Dates',
  render: () => {
    const today = new Date();
    const eventDates = [new Date(today.getFullYear(), today.getMonth(), 5), new Date(today.getFullYear(), today.getMonth(), 12), new Date(today.getFullYear(), today.getMonth(), 18), new Date(today.getFullYear(), today.getMonth(), 25)];
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="single" value={date} onChange={setDate} eventDates={eventDates} />
        <p className="text-body-sm text-[var(--color-text-subtle)]">Dates with dots have events</p>
      </div>;
  }
}`,...(B=(U=u.parameters)==null?void 0:U.docs)==null?void 0:B.source}}};var V,_,q;D.parameters={...D.parameters,docs:{...(V=D.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'With Min/Max Dates',
  render: () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 5);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 14);
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="single" value={date} onChange={setDate} minDate={minDate} maxDate={maxDate} />
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          Only dates within ±2 weeks are selectable
        </p>
      </div>;
  }
}`,...(q=(_=D.parameters)==null?void 0:_.docs)==null?void 0:q.source}}};var z,A,G;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'Monday Start',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="single" value={date} onChange={setDate} firstDayOfWeek={1} />
        <p className="text-body-sm text-[var(--color-text-subtle)]">Week starts on Monday</p>
      </div>;
  }
}`,...(G=(A=p.parameters)==null?void 0:A.docs)==null?void 0:G.source}}};var H,I,J;x.parameters={...x.parameters,docs:{...(H=x.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Sunday Start (Default)',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="single" value={date} onChange={setDate} firstDayOfWeek={0} />
        <p className="text-body-sm text-[var(--color-text-subtle)]">Week starts on Sunday</p>
      </div>;
  }
}`,...(J=(I=x.parameters)==null?void 0:I.docs)==null?void 0:J.source}}};var K,Q,X;v.parameters={...v.parameters,docs:{...(K=v.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    mode: 'single',
    disabled: true
  }
}`,...(X=(Q=v.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Z,$,ee;h.parameters={...h.parameters,docs:{...(Z=h.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  name: 'Use Case - Booking Calendar',
  render: () => {
    const today = new Date();
    const bookedDates = [new Date(today.getFullYear(), today.getMonth(), 8), new Date(today.getFullYear(), today.getMonth(), 9), new Date(today.getFullYear(), today.getMonth(), 10), new Date(today.getFullYear(), today.getMonth(), 15), new Date(today.getFullYear(), today.getMonth(), 22), new Date(today.getFullYear(), today.getMonth(), 23)];
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <h3 className="text-label-lg text-[var(--color-text-default)]">Select Check-in Date</h3>
        <DatePicker mode="single" value={date} onChange={setDate} eventDates={bookedDates} minDate={today} />
        <div className="flex items-center gap-[var(--primitive-spacing-4)] text-body-sm text-[var(--color-text-subtle)]">
          <span className="flex items-center gap-[var(--primitive-spacing-1)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-state-info)]"></span>
            Booked
          </span>
          <span className="flex items-center gap-[var(--primitive-spacing-1)]">
            <span className="w-2 h-2 rounded-full ring-1 ring-[var(--color-border-focus)]"></span>
            Today
          </span>
        </div>
      </div>;
  }
}`,...(ee=($=h.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var te,ae,se;y.parameters={...y.parameters,docs:{...(te=y.parameters)==null?void 0:te.docs,source:{originalSource:`{
  name: 'Use Case - Travel Date Range',
  render: () => {
    const today = new Date();
    const [range, setRange] = useState<{
      start: Date | null;
      end: Date | null;
    }>({
      start: null,
      end: null
    });
    const nights = range.start && range.end ? Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <h3 className="text-label-lg text-[var(--color-text-default)]">Select Travel Dates</h3>
        <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} minDate={today} firstDayOfWeek={1} />
        {nights > 0 && <p className="text-label-md text-[var(--color-state-info)]">
            {nights} night{nights > 1 ? 's' : ''} selected
          </p>}
      </div>;
  }
}`,...(se=(ae=y.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};var ne,re,oe;f.parameters={...f.parameters,docs:{...(ne=f.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  name: 'Use Case - Event Scheduler',
  render: () => {
    const today = new Date();
    const events = [new Date(today.getFullYear(), today.getMonth(), 3), new Date(today.getFullYear(), today.getMonth(), 7), new Date(today.getFullYear(), today.getMonth(), 14), new Date(today.getFullYear(), today.getMonth(), 21), new Date(today.getFullYear(), today.getMonth(), 28)];
    const [date, setDate] = useState<Date | null>(null);
    const selectedEvent = date && events.find(e => e.getDate() === date.getDate() && e.getMonth() === date.getMonth());
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <h3 className="text-label-lg text-[var(--color-text-default)]">Upcoming Events</h3>
        <DatePicker mode="single" value={date} onChange={setDate} eventDates={events} />
        {selectedEvent ? <p className="text-body-md text-[var(--color-state-success)]">
            Event on {selectedEvent.toLocaleDateString()}
          </p> : <p className="text-body-sm text-[var(--color-text-subtle)]">
            Click on a date with a dot to see the event
          </p>}
      </div>;
  }
}`,...(oe=(re=f.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};const De=["Default","SingleMode","RangeMode","WithPreselectedDate","WithPreselectedRange","WithEventDates","WithMinMaxDates","MondayStart","SundayStart","Disabled","BookingCalendar","TravelDateRange","EventScheduler"];export{h as BookingCalendar,c as Default,v as Disabled,f as EventScheduler,p as MondayStart,i as RangeMode,d as SingleMode,x as SundayStart,y as TravelDateRange,u as WithEventDates,D as WithMinMaxDates,g as WithPreselectedDate,m as WithPreselectedRange,De as __namedExportsOrder,ue as default};
