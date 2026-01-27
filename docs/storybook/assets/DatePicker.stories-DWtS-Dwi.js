import{r as o,j as t}from"./iframe-DKmDJy9M.js";import{D as r}from"./DatePicker-C0oQ0Bou.js";import"./preload-helper-C1FmrZbK.js";import"./IconChevronLeft-rXH75vem.js";import"./createReactComponent-DB1W9lnY.js";import"./IconChevronRight-Dymhorbf.js";const ue={title:"Components/DatePicker",component:r,parameters:{layout:"centered",docs:{description:{component:"날짜를 선택하는 캘린더 컴포넌트입니다. 단일 날짜 또는 날짜 범위를 선택할 수 있습니다."}}},tags:["autodocs"],argTypes:{mode:{control:"select",options:["single","range"],description:"선택 모드"},disabled:{control:"boolean",description:"비활성화 상태"},firstDayOfWeek:{control:"select",options:[0,1],description:"주 시작일 (0: 일요일, 1: 월요일)"}}},c={args:{mode:"single"}},d={name:"Single Date Selection",render:()=>{const[e,a]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[t.jsx(r,{mode:"single",value:e,onChange:a}),t.jsxs("p",{className:"text-sm text-gray-600",children:["Selected: ",e?e.toLocaleDateString():"None"]})]})}},g={name:"Date Range Selection",render:()=>{var n,s;const[e,a]=o.useState({start:null,end:null});return t.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[t.jsx(r,{mode:"range",rangeValue:e,onRangeChange:a}),t.jsxs("p",{className:"text-sm text-gray-600",children:["Range: ",((n=e.start)==null?void 0:n.toLocaleDateString())||"Start"," ~ ",((s=e.end)==null?void 0:s.toLocaleDateString())||"End"]})]})}},i={name:"With Pre-selected Date",render:()=>{const e=new Date,[a,n]=o.useState(e);return t.jsx(r,{mode:"single",value:a,onChange:n})}},m={name:"With Pre-selected Range",render:()=>{const e=new Date,a=new Date(e);a.setDate(e.getDate()+7);const[n,s]=o.useState({start:e,end:a});return t.jsx(r,{mode:"range",rangeValue:n,onRangeChange:s})}},u={name:"With Event Dates",render:()=>{const e=new Date,a=[new Date(e.getFullYear(),e.getMonth(),5),new Date(e.getFullYear(),e.getMonth(),12),new Date(e.getFullYear(),e.getMonth(),18),new Date(e.getFullYear(),e.getMonth(),25)],[n,s]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[t.jsx(r,{mode:"single",value:n,onChange:s,eventDates:a}),t.jsx("p",{className:"text-xs text-gray-500",children:"Dates with dots have events"})]})}},D={name:"With Min/Max Dates",render:()=>{const e=new Date,a=new Date(e);a.setDate(e.getDate()-5);const n=new Date(e);n.setDate(e.getDate()+14);const[s,l]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[t.jsx(r,{mode:"single",value:s,onChange:l,minDate:a,maxDate:n}),t.jsx("p",{className:"text-xs text-gray-500",children:"Only dates within ±2 weeks are selectable"})]})}},x={name:"Monday Start",render:()=>{const[e,a]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[t.jsx(r,{mode:"single",value:e,onChange:a,firstDayOfWeek:1}),t.jsx("p",{className:"text-xs text-gray-500",children:"Week starts on Monday"})]})}},p={name:"Sunday Start (Default)",render:()=>{const[e,a]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[t.jsx(r,{mode:"single",value:e,onChange:a,firstDayOfWeek:0}),t.jsx("p",{className:"text-xs text-gray-500",children:"Week starts on Sunday"})]})}},h={args:{mode:"single",disabled:!0}},y={name:"Use Case - Booking Calendar",render:()=>{const e=new Date,a=[new Date(e.getFullYear(),e.getMonth(),8),new Date(e.getFullYear(),e.getMonth(),9),new Date(e.getFullYear(),e.getMonth(),10),new Date(e.getFullYear(),e.getMonth(),15),new Date(e.getFullYear(),e.getMonth(),22),new Date(e.getFullYear(),e.getMonth(),23)],[n,s]=o.useState(null);return t.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[t.jsx("h3",{className:"text-sm font-medium",children:"Select Check-in Date"}),t.jsx(r,{mode:"single",value:n,onChange:s,eventDates:a,minDate:e}),t.jsxs("div",{className:"flex items-center gap-4 text-xs text-gray-500",children:[t.jsxs("span",{className:"flex items-center gap-1",children:[t.jsx("span",{className:"w-2 h-2 rounded-full bg-blue-500"}),"Booked"]}),t.jsxs("span",{className:"flex items-center gap-1",children:[t.jsx("span",{className:"w-2 h-2 rounded-full ring-1 ring-blue-500"}),"Today"]})]})]})}},v={name:"Use Case - Travel Date Range",render:()=>{const e=new Date,[a,n]=o.useState({start:null,end:null}),s=a.start&&a.end?Math.ceil((a.end.getTime()-a.start.getTime())/(1e3*60*60*24)):0;return t.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[t.jsx("h3",{className:"text-sm font-medium",children:"Select Travel Dates"}),t.jsx(r,{mode:"range",rangeValue:a,onRangeChange:n,minDate:e,firstDayOfWeek:1}),s>0&&t.jsxs("p",{className:"text-sm text-blue-600 font-medium",children:[s," night",s>1?"s":""," selected"]})]})}},f={name:"Use Case - Event Scheduler",render:()=>{const e=new Date,a=[new Date(e.getFullYear(),e.getMonth(),3),new Date(e.getFullYear(),e.getMonth(),7),new Date(e.getFullYear(),e.getMonth(),14),new Date(e.getFullYear(),e.getMonth(),21),new Date(e.getFullYear(),e.getMonth(),28)],[n,s]=o.useState(null),l=n&&a.find(S=>S.getDate()===n.getDate()&&S.getMonth()===n.getMonth());return t.jsxs("div",{className:"flex flex-col gap-4 items-center",children:[t.jsx("h3",{className:"text-sm font-medium",children:"Upcoming Events"}),t.jsx(r,{mode:"single",value:n,onChange:s,eventDates:a}),l?t.jsxs("p",{className:"text-sm text-green-600",children:["Event on ",l.toLocaleDateString()]}):t.jsx("p",{className:"text-xs text-gray-500",children:"Click on a date with a dot to see the event"})]})}};var w,M,N;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    mode: 'single'
  }
}`,...(N=(M=c.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var k,j,C;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'Single Date Selection',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-4 items-center">
        <DatePicker mode="single" value={date} onChange={setDate} />
        <p className="text-sm text-gray-600">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>;
  }
}`,...(C=(j=d.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var W,F,R;g.parameters={...g.parameters,docs:{...(W=g.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Date Range Selection',
  render: () => {
    const [range, setRange] = useState<{
      start: Date | null;
      end: Date | null;
    }>({
      start: null,
      end: null
    });
    return <div className="flex flex-col gap-4 items-center">
        <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />
        <p className="text-sm text-gray-600">
          Range: {range.start?.toLocaleDateString() || 'Start'} ~ {range.end?.toLocaleDateString() || 'End'}
        </p>
      </div>;
  }
}`,...(R=(F=g.parameters)==null?void 0:F.docs)==null?void 0:R.source}}};var Y,E,P;i.parameters={...i.parameters,docs:{...(Y=i.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  name: 'With Pre-selected Date',
  render: () => {
    const today = new Date();
    const [date, setDate] = useState<Date | null>(today);
    return <DatePicker mode="single" value={date} onChange={setDate} />;
  }
}`,...(P=(E=i.parameters)==null?void 0:E.docs)==null?void 0:P.source}}};var b,T,O;m.parameters={...m.parameters,docs:{...(b=m.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
    return <div className="flex flex-col gap-4 items-center">
        <DatePicker mode="single" value={date} onChange={setDate} eventDates={eventDates} />
        <p className="text-xs text-gray-500">
          Dates with dots have events
        </p>
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
    return <div className="flex flex-col gap-4 items-center">
        <DatePicker mode="single" value={date} onChange={setDate} minDate={minDate} maxDate={maxDate} />
        <p className="text-xs text-gray-500">
          Only dates within ±2 weeks are selectable
        </p>
      </div>;
  }
}`,...(q=(_=D.parameters)==null?void 0:_.docs)==null?void 0:q.source}}};var z,A,G;x.parameters={...x.parameters,docs:{...(z=x.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'Monday Start',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-4 items-center">
        <DatePicker mode="single" value={date} onChange={setDate} firstDayOfWeek={1} />
        <p className="text-xs text-gray-500">
          Week starts on Monday
        </p>
      </div>;
  }
}`,...(G=(A=x.parameters)==null?void 0:A.docs)==null?void 0:G.source}}};var H,I,J;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Sunday Start (Default)',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-4 items-center">
        <DatePicker mode="single" value={date} onChange={setDate} firstDayOfWeek={0} />
        <p className="text-xs text-gray-500">
          Week starts on Sunday
        </p>
      </div>;
  }
}`,...(J=(I=p.parameters)==null?void 0:I.docs)==null?void 0:J.source}}};var K,Q,X;h.parameters={...h.parameters,docs:{...(K=h.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    mode: 'single',
    disabled: true
  }
}`,...(X=(Q=h.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Z,$,ee;y.parameters={...y.parameters,docs:{...(Z=y.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  name: 'Use Case - Booking Calendar',
  render: () => {
    const today = new Date();
    const bookedDates = [new Date(today.getFullYear(), today.getMonth(), 8), new Date(today.getFullYear(), today.getMonth(), 9), new Date(today.getFullYear(), today.getMonth(), 10), new Date(today.getFullYear(), today.getMonth(), 15), new Date(today.getFullYear(), today.getMonth(), 22), new Date(today.getFullYear(), today.getMonth(), 23)];
    const [date, setDate] = useState<Date | null>(null);
    return <div className="flex flex-col gap-4 items-center">
        <h3 className="text-sm font-medium">Select Check-in Date</h3>
        <DatePicker mode="single" value={date} onChange={setDate} eventDates={bookedDates} minDate={today} />
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Booked
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full ring-1 ring-blue-500"></span>
            Today
          </span>
        </div>
      </div>;
  }
}`,...(ee=($=y.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var te,ae,ne;v.parameters={...v.parameters,docs:{...(te=v.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
    return <div className="flex flex-col gap-4 items-center">
        <h3 className="text-sm font-medium">Select Travel Dates</h3>
        <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} minDate={today} firstDayOfWeek={1} />
        {nights > 0 && <p className="text-sm text-blue-600 font-medium">
            {nights} night{nights > 1 ? 's' : ''} selected
          </p>}
      </div>;
  }
}`,...(ne=(ae=v.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};var se,re,oe;f.parameters={...f.parameters,docs:{...(se=f.parameters)==null?void 0:se.docs,source:{originalSource:`{
  name: 'Use Case - Event Scheduler',
  render: () => {
    const today = new Date();
    const events = [new Date(today.getFullYear(), today.getMonth(), 3), new Date(today.getFullYear(), today.getMonth(), 7), new Date(today.getFullYear(), today.getMonth(), 14), new Date(today.getFullYear(), today.getMonth(), 21), new Date(today.getFullYear(), today.getMonth(), 28)];
    const [date, setDate] = useState<Date | null>(null);
    const selectedEvent = date && events.find(e => e.getDate() === date.getDate() && e.getMonth() === date.getMonth());
    return <div className="flex flex-col gap-4 items-center">
        <h3 className="text-sm font-medium">Upcoming Events</h3>
        <DatePicker mode="single" value={date} onChange={setDate} eventDates={events} />
        {selectedEvent ? <p className="text-sm text-green-600">
            Event on {selectedEvent.toLocaleDateString()}
          </p> : <p className="text-xs text-gray-500">
            Click on a date with a dot to see the event
          </p>}
      </div>;
  }
}`,...(oe=(re=f.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};const De=["Default","SingleMode","RangeMode","WithPreselectedDate","WithPreselectedRange","WithEventDates","WithMinMaxDates","MondayStart","SundayStart","Disabled","BookingCalendar","TravelDateRange","EventScheduler"];export{y as BookingCalendar,c as Default,h as Disabled,f as EventScheduler,x as MondayStart,g as RangeMode,d as SingleMode,p as SundayStart,v as TravelDateRange,u as WithEventDates,D as WithMinMaxDates,i as WithPreselectedDate,m as WithPreselectedRange,De as __namedExportsOrder,ue as default};
