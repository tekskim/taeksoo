import{r as n,j as e}from"./iframe-CiM_PzFy.js";import{r as ne}from"./index-B2ySIuyi.js";import{t as I}from"./bundle-mjs-BZSatpsL.js";import{I as le}from"./IconX-y5i2oOQF.js";import{B as r}from"./Button-RS3XCeKS.js";import{I as i}from"./Input-B8mQURY-.js";import{S as oe}from"./Select-C01Kj4rs.js";import{T as g}from"./Toggle-DqPG2Yzi.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Dtj5WpGl.js";import"./IconChevronDown-CBNx6VPf.js";import"./IconCheck-EP2TORLX.js";function l({isOpen:a,onClose:s,title:t,side:b="right",width:o=320,showCloseButton:j=!0,closeOnBackdropClick:Q=!0,closeOnEscape:O=!0,children:Z,footer:N,className:ee}){const[te,C]=n.useState(a),[D,y]=n.useState(!1);n.useEffect(()=>{if(a)C(!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{y(!0)})});else{y(!1);const w=setTimeout(()=>{C(!1)},300);return()=>clearTimeout(w)}},[a]);const v=n.useCallback(w=>{O&&w.key==="Escape"&&s()},[O,s]);if(n.useEffect(()=>(a&&(document.addEventListener("keydown",v),document.body.style.overflow="hidden"),()=>{document.removeEventListener("keydown",v),document.body.style.overflow=""}),[a,v]),!te)return null;const se=typeof o=="number"?`${o}px`:o,re=I("fixed inset-0 z-50","bg-black/60","transition-opacity duration-300 ease-out",D?"opacity-100":"opacity-0"),ae=I("fixed top-0 bottom-0 z-50","bg-[var(--color-surface-default)]","flex flex-col","shadow-2xl","transition-transform duration-300 ease-out",b==="right"?"right-0":"left-0",D?"translate-x-0":b==="right"?"translate-x-full":"-translate-x-full",ee);return ne.createPortal(e.jsxs(e.Fragment,{children:[e.jsx("div",{className:re,onClick:Q?s:void 0,"aria-hidden":"true"}),e.jsxs("aside",{className:ae,style:{width:se},role:"dialog","aria-modal":"true","aria-labelledby":t?"drawer-title":void 0,children:[(t||j)&&e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]",children:[t&&e.jsx("h2",{id:"drawer-title",className:"text-heading-h5 text-[var(--color-text-default)]",children:t}),j&&e.jsx("button",{type:"button",onClick:s,className:"p-1 rounded hover:bg-[var(--color-surface-subtle)] transition-colors","aria-label":"Close drawer",children:e.jsx(le,{size:16,className:"text-[var(--color-text-muted)]"})})]}),e.jsx("div",{className:"flex-1 overflow-y-auto px-6 pt-4 pb-8 drawer-scroll",children:Z}),N&&e.jsx("div",{className:"border-t border-[var(--color-border-default)] px-6 py-4",children:N})]})]}),document.body)}const ge={title:"Components/Drawer",component:l,tags:["autodocs"],parameters:{docs:{description:{component:`
## Drawer 컴포넌트

화면 측면에서 슬라이드되어 나타나는 패널 컴포넌트입니다.

### 사용 시기
- 상세 정보 표시
- 설정/편집 폼
- 네비게이션 메뉴 (모바일)
- 필터 패널

### Modal vs Drawer
| | Modal | Drawer |
|---|---|---|
| **위치** | 화면 중앙 | 측면 (좌/우) |
| **크기** | 고정 또는 반응형 | 높이 100% |
| **사용 시점** | 중요한 결정 | 상세 정보, 폼 |
| **배경** | 어두운 오버레이 | 어두운 오버레이 |

### 접근성
- ESC 키로 닫기 지원
- 포커스 트랩 (Drawer 내에서만 Tab 이동)
- aria-modal, role="dialog" 자동 적용
- 닫기 버튼 제공

### 예시
\`\`\`tsx
import { Drawer } from '@thaki/tds';

<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="설정"
  side="right"
  width={400}
  footer={
    <Button onClick={handleSave}>저장</Button>
  }
>
  <p>Drawer 내용</p>
</Drawer>
\`\`\`
        `}}},argTypes:{isOpen:{control:"boolean",description:"Drawer 열림 상태",table:{type:{summary:"boolean"}}},title:{control:"text",description:"Drawer 헤더 제목",table:{type:{summary:"string"}}},side:{control:"select",options:["left","right"],description:"Drawer 표시 위치",table:{type:{summary:'"left" | "right"'},defaultValue:{summary:'"right"'}}},width:{control:"number",description:"Drawer 너비 (px)",table:{type:{summary:"number"},defaultValue:{summary:"320"}}},showCloseButton:{control:"boolean",description:"헤더에 닫기 버튼 표시",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},closeOnBackdropClick:{control:"boolean",description:"배경 클릭시 닫기 여부",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},closeOnEscape:{control:"boolean",description:"ESC 키로 닫기 여부",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},footer:{description:"Drawer 하단 고정 영역 (버튼 등)",table:{type:{summary:"ReactNode"}}}}},c={render:function(){const[s,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:()=>t(!0),children:"Open Drawer"}),e.jsx(l,{isOpen:s,onClose:()=>t(!1),title:"Drawer Title",children:e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"This is the drawer content. You can put any content here."})})]})}},d={render:function(){const[s,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:()=>t(!0),children:"Open Left Drawer"}),e.jsx(l,{isOpen:s,onClose:()=>t(!1),title:"Navigation",side:"left",width:280,children:e.jsxs("nav",{className:"flex flex-col gap-2",children:[e.jsx("a",{href:"#",className:"px-3 py-2 rounded hover:bg-[var(--color-surface-subtle)]",children:"Dashboard"}),e.jsx("a",{href:"#",className:"px-3 py-2 rounded hover:bg-[var(--color-surface-subtle)]",children:"Projects"}),e.jsx("a",{href:"#",className:"px-3 py-2 rounded hover:bg-[var(--color-surface-subtle)]",children:"Settings"})]})})]})}},u={render:function(){const[s,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:()=>t(!0),children:"Open Drawer with Footer"}),e.jsx(l,{isOpen:s,onClose:()=>t(!1),title:"Edit Item",footer:e.jsxs("div",{className:"flex gap-2 justify-end",children:[e.jsx(r,{variant:"secondary",onClick:()=>t(!1),children:"Cancel"}),e.jsx(r,{onClick:()=>t(!1),children:"Save Changes"})]}),children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(i,{label:"Name",placeholder:"Enter name",fullWidth:!0}),e.jsx(i,{label:"Description",placeholder:"Enter description",fullWidth:!0})]})})]})}},m={render:function(){const[s,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:()=>t(!0),children:"Edit Settings"}),e.jsx(l,{isOpen:s,onClose:()=>t(!1),title:"Instance Settings",width:400,footer:e.jsxs("div",{className:"flex gap-2 justify-end",children:[e.jsx(r,{variant:"secondary",onClick:()=>t(!1),children:"Cancel"}),e.jsx(r,{onClick:()=>t(!1),children:"Save"})]}),children:e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-sm font-medium",children:"General"}),e.jsx(i,{label:"Instance Name",defaultValue:"my-instance-01",fullWidth:!0}),e.jsx(oe,{label:"Region",options:[{value:"us-east",label:"US East"},{value:"us-west",label:"US West"},{value:"eu-west",label:"EU West"}],defaultValue:"us-east",fullWidth:!0})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-sm font-medium",children:"Features"}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm",children:"Auto-scaling"}),e.jsx(g,{defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm",children:"Monitoring"}),e.jsx(g,{defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm",children:"Backup"}),e.jsx(g,{})]})]})]})})]})}},p={render:function(){const[s,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:()=>t(!0),children:"Open Wide Drawer"}),e.jsx(l,{isOpen:s,onClose:()=>t(!1),title:"Detailed View",width:600,children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"This drawer is wider than the default to accommodate more content."}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(i,{label:"First Name",placeholder:"John"}),e.jsx(i,{label:"Last Name",placeholder:"Doe"}),e.jsx(i,{label:"Email",placeholder:"john@example.com"}),e.jsx(i,{label:"Phone",placeholder:"+1 234 567 890"})]})]})})]})}},f={render:function(){const[s,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:()=>t(!0),children:"Open Protected Drawer"}),e.jsx(l,{isOpen:s,onClose:()=>t(!1),title:"Important Form",closeOnBackdropClick:!1,closeOnEscape:!1,footer:e.jsxs("div",{className:"flex gap-2 justify-end",children:[e.jsx(r,{variant:"secondary",onClick:()=>t(!1),children:"Discard"}),e.jsx(r,{onClick:()=>t(!1),children:"Save"})]}),children:e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"This drawer can only be closed by clicking the buttons. Clicking the backdrop or pressing ESC won't close it."})})]})}},x={render:function(){const[s,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:()=>t(!0),children:"Open Drawer"}),e.jsx(l,{isOpen:s,onClose:()=>t(!1),children:e.jsxs("div",{className:"text-center py-8",children:[e.jsx("h2",{className:"text-lg font-semibold mb-2",children:"Custom Header"}),e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:"This drawer doesn't have a built-in title"})]})})]})}},h={render:function(){const[s,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:()=>t(!0),children:"Open Scrollable Drawer"}),e.jsx(l,{isOpen:s,onClose:()=>t(!1),title:"Long Content",footer:e.jsx(r,{onClick:()=>t(!1),fullWidth:!0,children:"Close"}),children:e.jsx("div",{className:"flex flex-col gap-4",children:Array.from({length:20},(b,o)=>e.jsxs("div",{className:"p-4 border border-[var(--color-border-default)] rounded",children:[e.jsxs("h3",{className:"font-medium",children:["Item ",o+1]}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["This is the description for item ",o+1,". It contains some text to demonstrate scrollable content."]})]},o))})})]})}};var k,S,B;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: function DefaultDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Drawer Title">
          <p className="text-sm text-[var(--color-text-muted)]">
            This is the drawer content. You can put any content here.
          </p>
        </Drawer>
      </>;
  }
}`,...(B=(S=c.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};var E,F,T;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: function LeftDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Navigation" side="left" width={280}>
          <nav className="flex flex-col gap-2">
            <a href="#" className="px-3 py-2 rounded hover:bg-[var(--color-surface-subtle)]">
              Dashboard
            </a>
            <a href="#" className="px-3 py-2 rounded hover:bg-[var(--color-surface-subtle)]">
              Projects
            </a>
            <a href="#" className="px-3 py-2 rounded hover:bg-[var(--color-surface-subtle)]">
              Settings
            </a>
          </nav>
        </Drawer>
      </>;
  }
}`,...(T=(F=d.parameters)==null?void 0:F.docs)==null?void 0:T.source}}};var W,L,V;u.parameters={...u.parameters,docs:{...(W=u.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: function FooterDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer with Footer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Item" footer={<div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
            </div>}>
          <div className="flex flex-col gap-4">
            <Input label="Name" placeholder="Enter name" fullWidth />
            <Input label="Description" placeholder="Enter description" fullWidth />
          </div>
        </Drawer>
      </>;
  }
}`,...(V=(L=u.parameters)==null?void 0:L.docs)==null?void 0:V.source}}};var A,P,R;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: function EditFormDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Edit Settings</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Instance Settings" width={400} footer={<div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </div>}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium">General</h3>
              <Input label="Instance Name" defaultValue="my-instance-01" fullWidth />
              <Select label="Region" options={[{
              value: 'us-east',
              label: 'US East'
            }, {
              value: 'us-west',
              label: 'US West'
            }, {
              value: 'eu-west',
              label: 'EU West'
            }]} defaultValue="us-east" fullWidth />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium">Features</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-scaling</span>
                <Toggle defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Monitoring</span>
                <Toggle defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup</span>
                <Toggle />
              </div>
            </div>
          </div>
        </Drawer>
      </>;
  }
}`,...(R=(P=m.parameters)==null?void 0:P.docs)==null?void 0:R.source}}};var U,M,_;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: function WideDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Wide Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Detailed View" width={600}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              This drawer is wider than the default to accommodate more content.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />
              <Input label="Email" placeholder="john@example.com" />
              <Input label="Phone" placeholder="+1 234 567 890" />
            </div>
          </div>
        </Drawer>
      </>;
  }
}`,...(_=(M=p.parameters)==null?void 0:M.docs)==null?void 0:_.source}}};var z,q,G;f.parameters={...f.parameters,docs:{...(z=f.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: function NoBackdropDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Protected Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Important Form" closeOnBackdropClick={false} closeOnEscape={false} footer={<div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Discard
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </div>}>
          <p className="text-sm text-[var(--color-text-muted)]">
            This drawer can only be closed by clicking the buttons. Clicking the backdrop or
            pressing ESC won't close it.
          </p>
        </Drawer>
      </>;
  }
}`,...(G=(q=f.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};var H,J,Y;x.parameters={...x.parameters,docs:{...(H=x.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: function NoTitleDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold mb-2">Custom Header</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              This drawer doesn't have a built-in title
            </p>
          </div>
        </Drawer>
      </>;
  }
}`,...(Y=(J=x.parameters)==null?void 0:J.docs)==null?void 0:Y.source}}};var K,X,$;h.parameters={...h.parameters,docs:{...(K=h.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: function ScrollableDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Scrollable Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Long Content" footer={<Button onClick={() => setIsOpen(false)} fullWidth>
              Close
            </Button>}>
          <div className="flex flex-col gap-4">
            {Array.from({
            length: 20
          }, (_, i) => <div key={i} className="p-4 border border-[var(--color-border-default)] rounded">
                <h3 className="font-medium">Item {i + 1}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  This is the description for item {i + 1}. It contains some text to demonstrate
                  scrollable content.
                </p>
              </div>)}
          </div>
        </Drawer>
      </>;
  }
}`,...($=(X=h.parameters)==null?void 0:X.docs)==null?void 0:$.source}}};const je=["Default","LeftSide","WithFooter","EditForm","WideDrawer","NoBackdropClose","NoTitle","ScrollableContent"];export{c as Default,m as EditForm,d as LeftSide,f as NoBackdropClose,x as NoTitle,h as ScrollableContent,p as WideDrawer,u as WithFooter,je as __namedExportsOrder,ge as default};
