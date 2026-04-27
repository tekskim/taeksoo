import{r as p,j as a}from"./iframe-DD6jyF7N.js";import{D as o}from"./DateRangePicker-CEFOfv8s.js";import"./preload-helper-C1FmrZbK.js";import"./DatePicker-Au-pYneR.js";import"./NumberInput-rdDMmQ7w.js";import"./cn-BMXv33oC.js";import"./IconChevronUp-Dt5qBDbK.js";import"./createReactComponent-BZMrecJg.js";import"./IconChevronDown-BtcBS3A-.js";import"./IconChevronLeft-DIbUa7_K.js";import"./IconChevronRight-BMUG6TI6.js";import"./IconClock-BeP9Ib01.js";import"./Select-VYrJo28S.js";import"./index-CW36Fogi.js";import"./overlayscrollbars-react-Bz5brGty.js";import"./IconX-t6wpnM2j.js";import"./IconCheck-DLNLhokL.js";const q={title:"Components/DateRangePicker",component:o,parameters:{layout:"centered",docs:{description:{component:"DatePicker를 감싸는 래퍼 컴포넌트로, START/END 날짜 헤더와 Cancel/Apply 버튼을 포함합니다."}}},tags:["autodocs"]},r={render:()=>{const[e,n]=p.useState("");return a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsx(o,{onApply:t=>n(`Applied: ${t.start.toLocaleDateString()} ~ ${t.end.toLocaleDateString()}`),onCancel:()=>n("Cancelled")}),e&&a.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:e})]})}},s={render:()=>{const e=new Date,n=new Date(e.getTime()-7*24*60*60*1e3);return a.jsx(o,{value:{start:n,end:e},onApply:t=>console.log("Applied:",t.start,"~",t.end),onCancel:()=>console.log("Cancelled")})}},l={render:()=>{const e=new Date,n=new Date(e.getTime()-30*24*60*60*1e3);return a.jsx(o,{minDate:n,maxDate:e,onApply:t=>console.log("Applied:",t.start,"~",t.end),onCancel:()=>console.log("Cancelled")})}},c={name:"Use Case - Monitoring Toolbar",render:()=>{const[e,n]=p.useState(!0),[t,w]=p.useState("");return a.jsxs("div",{className:"flex flex-col gap-4",children:[!e&&a.jsx("button",{className:"text-body-md text-[var(--color-action-primary)] cursor-pointer bg-transparent border-none",onClick:()=>n(!0),children:"Open DateRangePicker"}),e&&a.jsx(o,{maxDate:new Date,onApply:i=>{w(`${i.start.toLocaleDateString()} ~ ${i.end.toLocaleDateString()}`),n(!1)},onCancel:()=>n(!1)}),t&&a.jsxs("p",{className:"text-body-md text-[var(--color-text-default)]",children:["Selected period: ",t]})]})}};var d,m,g;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [result, setResult] = useState<string>('');
    return <div className="flex flex-col gap-4">
        <DateRangePicker onApply={range => setResult(\`Applied: \${range.start.toLocaleDateString()} ~ \${range.end.toLocaleDateString()}\`)} onCancel={() => setResult('Cancelled')} />
        {result && <p className="text-body-md text-[var(--color-text-muted)]">{result}</p>}
      </div>;
  }
}`,...(g=(m=r.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var u,x,D;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return <DateRangePicker value={{
      start: oneWeekAgo,
      end: now
    }} onApply={range => console.log('Applied:', range.start, '~', range.end)} onCancel={() => console.log('Cancelled')} />;
  }
}`,...(D=(x=s.parameters)==null?void 0:x.docs)==null?void 0:D.source}}};var A,y,R;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return <DateRangePicker minDate={thirtyDaysAgo} maxDate={now} onApply={range => console.log('Applied:', range.start, '~', range.end)} onCancel={() => console.log('Cancelled')} />;
  }
}`,...(R=(y=l.parameters)==null?void 0:y.docs)==null?void 0:R.source}}};var C,S,f;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'Use Case - Monitoring Toolbar',
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [appliedRange, setAppliedRange] = useState<string>('');
    return <div className="flex flex-col gap-4">
        {!isOpen && <button className="text-body-md text-[var(--color-action-primary)] cursor-pointer bg-transparent border-none" onClick={() => setIsOpen(true)}>
            Open DateRangePicker
          </button>}
        {isOpen && <DateRangePicker maxDate={new Date()} onApply={range => {
        setAppliedRange(\`\${range.start.toLocaleDateString()} ~ \${range.end.toLocaleDateString()}\`);
        setIsOpen(false);
      }} onCancel={() => setIsOpen(false)} />}
        {appliedRange && <p className="text-body-md text-[var(--color-text-default)]">
            Selected period: {appliedRange}
          </p>}
      </div>;
  }
}`,...(f=(S=c.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};const z=["Default","WithPreselectedRange","WithMinMaxDates","MonitoringToolbarUseCase"];export{r as Default,c as MonitoringToolbarUseCase,l as WithMinMaxDates,s as WithPreselectedRange,z as __namedExportsOrder,q as default};
