import{r as t,j as e,R as Fe}from"./iframe-C-CGJmyb.js";import{r as Re}from"./index-KOaWZOGP.js";import{H as b,V as L}from"./Stack-sKp-25XK.js";import{B as o}from"./Button-CFzl0PLa.js";import{I as Ve}from"./IconInfoCircle-ECRjnW7L.js";import{F as qe}from"./FormField-BFuRyVI1.js";import{I as Le}from"./Input-DYjPjFqM.js";import{I as Me}from"./IconUser-CiGwyNU7.js";import{I as Ae}from"./IconSettings-wPFUXyKo.js";import{I as We}from"./IconLogout-nNopTIi2.js";import"./preload-helper-C1FmrZbK.js";import"./cn-CshvV4Tc.js";import"./createReactComponent-BvK7gRRe.js";function u({content:v,children:p,position:x="bottom",trigger:a="click",delay:M=200,hideDelay:A=150,disabled:g=!1,isOpen:W,onOpenChange:y,closeOnOutsideClick:U=!0,closeOnEscape:Q=!0,showArrow:R=!0,className:je="","aria-label":Ce}){const[Se,Te]=t.useState(!1),[Pe,V]=t.useState(!1),[_,Be]=t.useState({x:0,y:0}),h=t.useRef(null),w=t.useRef(null),N=t.useRef(void 0),k=t.useRef(void 0),q=W!==void 0,s=q?W:Se,f=t.useCallback(r=>{q||Te(r),y==null||y(r)},[q,y]),j=t.useCallback(()=>{if(!h.current||!w.current)return;const r=h.current.getBoundingClientRect(),i=w.current.getBoundingClientRect(),l=R?8:4;let c=0,d=0;switch(x){case"top":c=r.left+(r.width-i.width)/2,d=r.top-i.height-l;break;case"bottom":c=r.left+(r.width-i.width)/2,d=r.bottom+l;break;case"left":c=r.left-i.width-l,d=r.top+(r.height-i.height)/2;break;case"right":c=r.right+l,d=r.top+(r.height-i.height)/2;break}c=Math.max(8,Math.min(c,window.innerWidth-i.width-8)),d=Math.max(8,Math.min(d,window.innerHeight-i.height-8)),Be({x:c,y:d}),V(!0)},[x,R]),m=t.useCallback(()=>{N.current&&(clearTimeout(N.current),N.current=void 0),k.current&&(clearTimeout(k.current),k.current=void 0)},[]),C=t.useCallback(()=>{g||(m(),a==="hover"?N.current=window.setTimeout(()=>{f(!0)},M):f(!0))},[g,a,M,f,m]),n=t.useCallback(()=>{m(),a==="hover"?k.current=window.setTimeout(()=>{f(!1),V(!1)},A):(f(!1),V(!1))},[a,A,f,m]),S=t.useCallback(()=>{g||(s?n():C())},[g,s,C,n]),Ie=t.useCallback(()=>{a==="click"&&S()},[a,S]),Ee=t.useCallback(r=>{a==="click"&&(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),S())},[a,S]),Oe=t.useCallback(()=>{a==="hover"&&m()},[a,m]),ze=t.useCallback(()=>{a==="hover"&&n()},[a,n]);t.useEffect(()=>{if(!s||!Q)return;const r=i=>{var l;i.key==="Escape"&&(n(),(l=h.current)==null||l.focus())};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[s,Q,n]),t.useEffect(()=>{if(!s||!U||a==="hover")return;const r=i=>{var c,d;const l=i.target;(c=h.current)!=null&&c.contains(l)||(d=w.current)!=null&&d.contains(l)||n()};return document.addEventListener("mousedown",r),()=>document.removeEventListener("mousedown",r)},[s,U,a,n]),t.useEffect(()=>{s&&requestAnimationFrame(()=>{j()})},[s,j]),t.useEffect(()=>{if(!s)return;const r=()=>j();return window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}},[s,j]),t.useEffect(()=>()=>m(),[m]);const De=r=>{switch(r){case"bottom":return e.jsxs("div",{className:"absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]",children:[e.jsx("div",{className:"w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-[var(--color-border-default)]"}),e.jsx("div",{className:"absolute bottom-0 left-1/2 -translate-x-1/2 mb-[-1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--color-surface-default)]"})]});case"top":return e.jsxs("div",{className:"absolute top-full left-1/2 -translate-x-1/2 -mt-px",children:[e.jsx("div",{className:"w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[var(--color-border-default)]"}),e.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-surface-default)]"})]});case"left":return e.jsxs("div",{className:"absolute left-full top-1/2 -translate-y-1/2 -ml-px",children:[e.jsx("div",{className:"w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[7px] border-l-[var(--color-border-default)]"}),e.jsx("div",{className:"absolute left-0 top-1/2 -translate-y-1/2 -ml-[1px] w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[var(--color-surface-default)]"})]});case"right":return e.jsxs("div",{className:"absolute right-full top-1/2 -translate-y-1/2 -mr-px",children:[e.jsx("div",{className:"w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-[var(--color-border-default)]"}),e.jsx("div",{className:"absolute right-0 top-1/2 -translate-y-1/2 -mr-[1px] w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[var(--color-surface-default)]"})]})}},K=`popover-${t.useId()}`,He=t.isValidElement(p)?t.cloneElement(p,{"aria-expanded":s,"aria-haspopup":"dialog","aria-controls":s?K:void 0}):p;return e.jsxs(e.Fragment,{children:[e.jsx("div",{ref:h,onClick:Ie,onKeyDown:Ee,onMouseEnter:a==="hover"?C:void 0,onMouseLeave:a==="hover"?n:void 0,onFocus:a==="hover"?C:void 0,onBlur:a==="hover"?n:void 0,className:"inline-flex",children:He}),s&&Re.createPortal(e.jsx("div",{ref:w,id:K,role:"dialog","aria-label":Ce,"aria-modal":a==="click",onMouseEnter:Oe,onMouseLeave:ze,className:"fixed z-[var(--z-popover,1050)] transition-opacity duration-[var(--duration-fast)]",style:{left:_.x,top:_.y,opacity:Pe?1:0},children:e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:`
                  bg-[var(--color-surface-default)]
                  border border-[var(--color-border-default)]
                  rounded-[var(--primitive-radius-lg)]
                  shadow-lg
                  ${je}
                `,children:v}),R&&De(x)]})}),document.body)]})}u.__docgenInfo={description:"",methods:[],displayName:"Popover",props:{content:{required:!0,tsType:{name:"ReactNode"},description:"Popover content - can be interactive"},children:{required:!0,tsType:{name:"ReactNode"},description:"Trigger element"},position:{required:!1,tsType:{name:"union",raw:"'top' | 'bottom' | 'left' | 'right'",elements:[{name:"literal",value:"'top'"},{name:"literal",value:"'bottom'"},{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:"Position relative to trigger",defaultValue:{value:"'bottom'",computed:!1}},trigger:{required:!1,tsType:{name:"union",raw:"'hover' | 'click'",elements:[{name:"literal",value:"'hover'"},{name:"literal",value:"'click'"}]},description:"How to trigger the popover",defaultValue:{value:"'click'",computed:!1}},delay:{required:!1,tsType:{name:"number"},description:"Delay before showing (ms) - only for hover trigger",defaultValue:{value:"200",computed:!1}},hideDelay:{required:!1,tsType:{name:"number"},description:"Delay before hiding (ms) - only for hover trigger",defaultValue:{value:"150",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"Disable popover",defaultValue:{value:"false",computed:!1}},isOpen:{required:!1,tsType:{name:"boolean"},description:"Controlled open state"},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(isOpen: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"isOpen"}],return:{name:"void"}}},description:"Callback when open state changes"},closeOnOutsideClick:{required:!1,tsType:{name:"boolean"},description:"Close on outside click - default true for click trigger",defaultValue:{value:"true",computed:!1}},closeOnEscape:{required:!1,tsType:{name:"boolean"},description:"Close on escape key - default true",defaultValue:{value:"true",computed:!1}},showArrow:{required:!1,tsType:{name:"boolean"},description:"Show arrow",defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom class for popover content",defaultValue:{value:"''",computed:!1}},"aria-label":{required:!1,tsType:{name:"string"},description:"Accessible label for the popover"}}};const or={title:"Components/Popover",component:u,parameters:{layout:"centered",docs:{description:{component:`
Popover는 Tooltip의 확장형으로, 인터랙티브한 콘텐츠를 표시하는 오버레이 컴포넌트입니다.

**Tooltip과의 차이점:**
- **Tooltip**: 텍스트만, 비인터랙티브, hover 전용
- **Popover**: 인터랙티브 콘텐츠 (폼, 메뉴, 버튼), click/hover 지원

**디자인 토큰:**
- Background: \`var(--color-surface-default)\`
- Border: \`var(--color-border-default)\`, 1px
- Radius: \`var(--primitive-radius-lg)\` (8px)
- Shadow: \`shadow-lg\`
- Arrow: double-triangle border technique (7px outer / 6px inner)
        `}}},tags:["autodocs"],argTypes:{position:{control:"select",options:["top","bottom","left","right"],description:"Position relative to the trigger element"},trigger:{control:"select",options:["hover","click"],description:"How to trigger the popover (click or hover)"},showArrow:{control:"boolean",description:"Show the arrow indicator"},disabled:{control:"boolean",description:"Disable the popover"},delay:{control:"number",description:"Delay before showing (ms) - hover trigger only"},hideDelay:{control:"number",description:"Delay before hiding (ms) - hover trigger only"}}},T={args:{content:e.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:e.jsx("p",{className:"text-body-md text-[var(--color-text-default)]",children:"This is a popover with interactive content."})}),children:e.jsx(o,{variant:"secondary",children:"Click me"}),trigger:"click",position:"bottom"}},P={args:{content:e.jsx("div",{className:"p-[var(--primitive-spacing-3)]",children:e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Hover to see more information"})}),children:e.jsx(o,{variant:"ghost",children:"Hover me"}),trigger:"hover",position:"top"}},B={render:()=>e.jsx(u,{trigger:"click",position:"bottom",content:e.jsxs(L,{gap:1,className:"p-[var(--primitive-spacing-2)] min-w-[160px]",children:[e.jsxs("button",{className:"flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left",children:[e.jsx(Me,{size:16}),"Profile"]}),e.jsxs("button",{className:"flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left",children:[e.jsx(Ae,{size:16}),"Settings"]}),e.jsx("div",{className:"w-full h-px bg-[var(--color-border-subtle)] my-[var(--primitive-spacing-1)]"}),e.jsxs("button",{className:"flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-state-danger)] hover:bg-[var(--color-state-danger-bg)] rounded-[var(--primitive-radius-sm)] w-full text-left",children:[e.jsx(We,{size:16}),"Logout"]})]}),children:e.jsx(o,{variant:"secondary",children:"User Menu"})})},I={render:()=>e.jsx(b,{gap:4,children:["top","bottom","left","right"].map(v=>e.jsx(u,{trigger:"click",position:v,content:e.jsx("div",{className:"p-[var(--primitive-spacing-3)]",children:e.jsxs("p",{className:"text-body-md text-[var(--color-text-default)]",children:["Position: ",v]})}),children:e.jsx(o,{variant:"outline",children:v})},v))})},E={args:{content:e.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:e.jsx("p",{className:"text-body-md text-[var(--color-text-default)]",children:"Popover without arrow"})}),children:e.jsx(o,{variant:"secondary",children:"No Arrow"}),showArrow:!1,trigger:"click"}},O={render:()=>e.jsx(u,{trigger:"click",position:"bottom",content:e.jsxs(L,{gap:3,className:"p-[var(--primitive-spacing-4)] w-[280px]",children:[e.jsx("h4",{className:"text-heading-h6 text-[var(--color-text-default)]",children:"Quick Settings"}),e.jsxs("div",{children:[e.jsx("label",{className:"text-label-sm text-[var(--color-text-muted)] block mb-[var(--primitive-spacing-1)]",children:"Display Name"}),e.jsx("input",{type:"text",className:"w-full px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md border border-[var(--color-border-default)] rounded-[var(--primitive-radius-sm)] bg-[var(--color-surface-default)]",placeholder:"Enter name"})]}),e.jsxs(b,{gap:2,className:"w-full",children:[e.jsx(o,{variant:"secondary",size:"sm",className:"flex-1",children:"Cancel"}),e.jsx(o,{variant:"primary",size:"sm",className:"flex-1",children:"Save"})]})]}),children:e.jsx(o,{variant:"primary",children:"Open Form"})})},z={render:function(){const[p,x]=Fe.useState(!1);return e.jsxs(b,{gap:4,children:[e.jsx(u,{trigger:"click",isOpen:p,onOpenChange:x,content:e.jsxs("div",{className:"p-[var(--primitive-spacing-4)]",children:[e.jsxs("p",{className:"text-body-md text-[var(--color-text-default)]",children:["Controlled popover state: ",p?"Open":"Closed"]}),e.jsx(o,{variant:"secondary",size:"sm",className:"mt-[var(--primitive-spacing-2)]",onClick:()=>x(!1),children:"Close"})]}),children:e.jsx(o,{variant:"secondary",children:"Controlled"})}),e.jsxs(o,{variant:"outline",onClick:()=>x(!p),children:["Toggle: ",p?"Open":"Closed"]})]})}},D={args:{content:e.jsx("div",{className:"p-[var(--primitive-spacing-3)]",children:e.jsx("p",{className:"text-body-md",children:"This won't show"})}),children:e.jsx(o,{variant:"secondary",disabled:!0,children:"Disabled"}),disabled:!0,trigger:"click"}},H={render:()=>e.jsx(u,{trigger:"click",position:"bottom",content:e.jsxs(L,{gap:3,className:"p-[var(--primitive-spacing-4)] w-[280px]",children:[e.jsx("h4",{className:"text-heading-h6 text-[var(--color-text-default)]",children:"Quick Settings"}),e.jsx(qe,{label:"Display Name",helperText:"2-64 characters",children:e.jsx(Le,{placeholder:"Enter name",fullWidth:!0})}),e.jsxs(b,{gap:2,className:"w-full",children:[e.jsx(o,{variant:"secondary",size:"sm",className:"flex-1",children:"Cancel"}),e.jsx(o,{variant:"primary",size:"sm",className:"flex-1",children:"Save"})]})]}),children:e.jsx(o,{variant:"primary",children:"Open Form"})})},F={render:()=>e.jsxs(b,{gap:2,align:"center",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"Instance Type"}),e.jsx(u,{trigger:"hover",position:"top",content:e.jsx("div",{className:"p-3 max-w-[240px]",children:e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:"인스턴스 타입은 생성 후 변경할 수 없습니다. 신중하게 선택해 주세요."})}),children:e.jsx("button",{className:"text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]",children:e.jsx(Ve,{size:14})})})]})};var $,G,J;T.parameters={...T.parameters,docs:{...($=T.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    content: <div className="p-[var(--primitive-spacing-4)]">
        <p className="text-body-md text-[var(--color-text-default)]">
          This is a popover with interactive content.
        </p>
      </div>,
    children: <Button variant="secondary">Click me</Button>,
    trigger: 'click',
    position: 'bottom'
  }
}`,...(J=(G=T.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};var X,Y,Z;P.parameters={...P.parameters,docs:{...(X=P.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    content: <div className="p-[var(--primitive-spacing-3)]">
        <p className="text-body-sm text-[var(--color-text-muted)]">Hover to see more information</p>
      </div>,
    children: <Button variant="ghost">Hover me</Button>,
    trigger: 'hover',
    position: 'top'
  }
}`,...(Z=(Y=P.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,re,te;B.parameters={...B.parameters,docs:{...(ee=B.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <Popover trigger="click" position="bottom" content={<VStack gap={1} className="p-[var(--primitive-spacing-2)] min-w-[160px]">
          <button className="flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left">
            <IconUser size={16} />
            Profile
          </button>
          <button className="flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left">
            <IconSettings size={16} />
            Settings
          </button>
          <div className="w-full h-px bg-[var(--color-border-subtle)] my-[var(--primitive-spacing-1)]" />
          <button className="flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-state-danger)] hover:bg-[var(--color-state-danger-bg)] rounded-[var(--primitive-radius-sm)] w-full text-left">
            <IconLogout size={16} />
            Logout
          </button>
        </VStack>}>
      <Button variant="secondary">User Menu</Button>
    </Popover>
}`,...(te=(re=B.parameters)==null?void 0:re.docs)==null?void 0:te.source}}};var ae,oe,se;I.parameters={...I.parameters,docs:{...(ae=I.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => <HStack gap={4}>
      {(['top', 'bottom', 'left', 'right'] as const).map(position => <Popover key={position} trigger="click" position={position} content={<div className="p-[var(--primitive-spacing-3)]">
              <p className="text-body-md text-[var(--color-text-default)]">Position: {position}</p>
            </div>}>
          <Button variant="outline">{position}</Button>
        </Popover>)}
    </HStack>
}`,...(se=(oe=I.parameters)==null?void 0:oe.docs)==null?void 0:se.source}}};var ie,ne,le;E.parameters={...E.parameters,docs:{...(ie=E.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    content: <div className="p-[var(--primitive-spacing-4)]">
        <p className="text-body-md text-[var(--color-text-default)]">Popover without arrow</p>
      </div>,
    children: <Button variant="secondary">No Arrow</Button>,
    showArrow: false,
    trigger: 'click'
  }
}`,...(le=(ne=E.parameters)==null?void 0:ne.docs)==null?void 0:le.source}}};var ce,de,pe;O.parameters={...O.parameters,docs:{...(ce=O.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <Popover trigger="click" position="bottom" content={<VStack gap={3} className="p-[var(--primitive-spacing-4)] w-[280px]">
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">Quick Settings</h4>
          <div>
            <label className="text-label-sm text-[var(--color-text-muted)] block mb-[var(--primitive-spacing-1)]">
              Display Name
            </label>
            <input type="text" className="w-full px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md border border-[var(--color-border-default)] rounded-[var(--primitive-radius-sm)] bg-[var(--color-surface-default)]" placeholder="Enter name" />
          </div>
          <HStack gap={2} className="w-full">
            <Button variant="secondary" size="sm" className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="flex-1">
              Save
            </Button>
          </HStack>
        </VStack>}>
      <Button variant="primary">Open Form</Button>
    </Popover>
}`,...(pe=(de=O.parameters)==null?void 0:de.docs)==null?void 0:pe.source}}};var me,ue,ve;z.parameters={...z.parameters,docs:{...(me=z.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: function ControlledPopover() {
    const [isOpen, setIsOpen] = React.useState(false);
    return <HStack gap={4}>
        <Popover trigger="click" isOpen={isOpen} onOpenChange={setIsOpen} content={<div className="p-[var(--primitive-spacing-4)]">
              <p className="text-body-md text-[var(--color-text-default)]">
                Controlled popover state: {isOpen ? 'Open' : 'Closed'}
              </p>
              <Button variant="secondary" size="sm" className="mt-[var(--primitive-spacing-2)]" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>}>
          <Button variant="secondary">Controlled</Button>
        </Popover>
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
          Toggle: {isOpen ? 'Open' : 'Closed'}
        </Button>
      </HStack>;
  }
}`,...(ve=(ue=z.parameters)==null?void 0:ue.docs)==null?void 0:ve.source}}};var xe,fe,he;D.parameters={...D.parameters,docs:{...(xe=D.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    content: <div className="p-[var(--primitive-spacing-3)]">
        <p className="text-body-md">This won't show</p>
      </div>,
    children: <Button variant="secondary" disabled>
        Disabled
      </Button>,
    disabled: true,
    trigger: 'click'
  }
}`,...(he=(fe=D.parameters)==null?void 0:fe.docs)==null?void 0:he.source}}};var be,ge,ye;H.parameters={...H.parameters,docs:{...(be=H.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => <Popover trigger="click" position="bottom" content={<VStack gap={3} className="p-[var(--primitive-spacing-4)] w-[280px]">
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">Quick Settings</h4>
          <FormField label="Display Name" helperText="2-64 characters">
            <Input placeholder="Enter name" fullWidth />
          </FormField>
          <HStack gap={2} className="w-full">
            <Button variant="secondary" size="sm" className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="flex-1">
              Save
            </Button>
          </HStack>
        </VStack>}>
      <Button variant="primary">Open Form</Button>
    </Popover>
}`,...(ye=(ge=H.parameters)==null?void 0:ge.docs)==null?void 0:ye.source}}};var we,Ne,ke;F.parameters={...F.parameters,docs:{...(we=F.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <HStack gap={2} align="center">
      <span className="text-body-md text-[var(--color-text-default)]">Instance Type</span>
      <Popover trigger="hover" position="top" content={<div className="p-3 max-w-[240px]">
            <p className="text-body-sm text-[var(--color-text-muted)]">
              인스턴스 타입은 생성 후 변경할 수 없습니다. 신중하게 선택해 주세요.
            </p>
          </div>}>
        <button className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]">
          <IconInfoCircle size={14} />
        </button>
      </Popover>
    </HStack>
}`,...(ke=(Ne=F.parameters)==null?void 0:Ne.docs)==null?void 0:ke.source}}};const sr=["Default","HoverTrigger","WithMenu","Positions","NoArrow","WithForm","Controlled","Disabled","WithFormField","InfoPopover"];export{z as Controlled,T as Default,D as Disabled,P as HoverTrigger,F as InfoPopover,E as NoArrow,I as Positions,O as WithForm,H as WithFormField,B as WithMenu,sr as __namedExportsOrder,or as default};
