import{r as a,j as e}from"./iframe-BGa_n0Au.js";import{r as re}from"./index-TWFM_iTt.js";import{t as w}from"./cn-BMXv33oC.js";import{u as ie}from"./useFocusTrap-DYrBRzCg.js";import{I as le}from"./InlineMessage-C7L7rgzD.js";import{B as o}from"./Button-DSEeEmmE.js";import{F as B}from"./FormField-DaB76NCi.js";import{I as N}from"./Input-BC5MyoFU.js";import"./preload-helper-C1FmrZbK.js";import"./IconInfoCircle-QNaiuI5z.js";import"./createReactComponent-B5dOz73m.js";import"./IconAlertTriangle-D-uwEaCA.js";import"./IconAlertCircle-nErGPt13.js";import"./IconCircleCheck-CCv_bBwg.js";function E(s){const n=a.useId();return s?`${s}-${n}`:n}function f({isOpen:s,onClose:n,title:t,description:r,children:i,closeOnBackdropClick:l=!0,closeOnEscape:c=!0,size:m="sm",className:u,...g}){const[p,h]=a.useState(s),[C,S]=a.useState(!1),k=E("modal-title"),T=E("modal-desc"),ee=ie(s);a.useEffect(()=>{if(s)h(!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{S(!0)})});else{S(!1);const d=setTimeout(()=>{h(!1)},200);return()=>clearTimeout(d)}},[s]),a.useEffect(()=>{if(!s||!c)return;const d=oe=>{oe.key==="Escape"&&n()};return document.addEventListener("keydown",d),()=>document.removeEventListener("keydown",d)},[s,c,n]),a.useEffect(()=>(s?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[s]);const te=a.useCallback(()=>{l&&n()},[l,n]),ne=m==="md"?"w-[480px]":m==="lg"?"w-[640px]":"w-[360px]";if(!p)return null;const se=w("fixed inset-0 z-[var(--z-modal)]","bg-[color-mix(in_srgb,var(--color-text-default)_60%,transparent)]","flex items-center justify-center","transition-opacity duration-200 ease-out",C?"opacity-100":"opacity-0"),ae=w("bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","rounded-[var(--radius-xl)]","shadow-[0px_0px_4px_0px_color-mix(in_srgb,var(--color-text-default)_10%,transparent)]","p-4","flex flex-col gap-4","transition-all duration-200 ease-out",C?"opacity-100 scale-100":"opacity-0 scale-95","max-w-[calc(100vw-2rem)]",ne,u);return re.createPortal(e.jsx("div",{className:se,onClick:te,children:e.jsxs("div",{"data-figma-name":"[TDS] Overlay",...g,ref:ee,className:ae,onClick:d=>d.stopPropagation(),role:"dialog","aria-modal":"true","aria-labelledby":k,"aria-describedby":r?T:void 0,children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("h2",{id:k,className:"text-heading-h5 text-[var(--color-text-default)]",children:t}),r&&e.jsx("p",{id:T,className:"text-body-md text-[var(--color-text-subtle)]",children:r})]}),i]})}),document.body)}const ce={danger:"error",warning:"warning",primary:"info"};function x({isOpen:s,onClose:n,onConfirm:t,title:r,description:i,confirmText:l="Confirm",cancelText:c="Cancel",confirmVariant:m="primary",infoLabel:u,infoValue:g,isLoading:p=!1,...h}){const C=ce[m]??"info";return e.jsxs(f,{isOpen:s,onClose:n,title:r,...h,children:[(u||i)&&e.jsxs("div",{className:"flex flex-col gap-2",children:[u&&g&&e.jsxs("div",{className:"bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3 flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-label-sm text-[var(--color-text-subtle)]",children:u}),e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:g})]}),i&&e.jsx(le,{variant:C,children:i})]}),e.jsxs("div",{className:"flex gap-2 w-full",children:[e.jsx(o,{variant:"outline",size:"md",onClick:n,disabled:p,className:"flex-1",children:c}),e.jsx(o,{variant:m,size:"md",onClick:t,disabled:p,className:"flex-1",children:p?"Processing...":l})]})]})}x.__docgenInfo={description:"",methods:[],displayName:"ConfirmModal",props:{confirmText:{required:!1,tsType:{name:"string"},description:"Confirm button text",defaultValue:{value:"'Confirm'",computed:!1}},cancelText:{required:!1,tsType:{name:"string"},description:"Cancel button text",defaultValue:{value:"'Cancel'",computed:!1}},confirmVariant:{required:!1,tsType:{name:"union",raw:"'primary' | 'danger' | 'warning'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"}]},description:"Confirm button variant",defaultValue:{value:"'primary'",computed:!1}},onConfirm:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when confirmed"},infoLabel:{required:!1,tsType:{name:"string"},description:"Info box content"},infoValue:{required:!1,tsType:{name:"string"},description:"Info box value"},isLoading:{required:!1,tsType:{name:"boolean"},description:"Loading state",defaultValue:{value:"false",computed:!1}}},composes:["Omit"]};const je={title:"Components/Modal",component:f,tags:["autodocs"],parameters:{docs:{description:{component:`
## Modal 컴포넌트

사용자의 주의를 집중시키는 오버레이 다이얼로그입니다.

### 종류
- **Modal**: 커스텀 콘텐츠를 담는 기본 모달
- **ConfirmModal**: 확인/취소 액션이 있는 확인 모달

### 사용 시기
- 중요한 정보 확인
- 삭제/제출 전 확인
- 폼 입력 (간단한 경우)
- 에러/경고 메시지

### 접근성
- ESC 키로 닫기 지원
- 포커스 트랩 (모달 내에서만 Tab 이동)
- 배경 클릭으로 닫기 (선택적)
- aria-modal, role="dialog" 자동 적용

### 예시
\`\`\`tsx
import { Modal, ConfirmModal } from '@thaki/tds';

// 기본 모달
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="제목"
>
  내용
</Modal>

// 확인 모달
<ConfirmModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="삭제 확인"
  description="정말 삭제하시겠습니까?"
  confirmVariant="danger"
/>
\`\`\`
        `}}},argTypes:{title:{control:"text",description:"모달 제목",table:{type:{summary:"string"}}},description:{control:"text",description:"모달 설명 (제목 아래 표시)",table:{type:{summary:"string"}}},closeOnBackdropClick:{control:"boolean",description:"배경 클릭시 닫기 여부",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},closeOnEscape:{control:"boolean",description:"ESC 키로 닫기 여부",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},isOpen:{control:"boolean",description:"모달 열림 상태",table:{type:{summary:"boolean"}}},onClose:{description:"모달 닫기 콜백",table:{type:{summary:"() => void"}}}}},v={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Modal"}),e.jsx(f,{isOpen:n,onClose:()=>t(!1),title:"Modal Title",description:"This is a description text that provides more context about the modal.",children:e.jsx("div",{className:"text-body-md text-[var(--color-text-default)]",children:"Modal content goes here. You can put any content inside the modal."})})]})}},O={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Confirm Modal"}),e.jsx(x,{isOpen:n,onClose:()=>t(!1),onConfirm:()=>{alert("Confirmed!"),t(!1)},title:"Confirm Action",description:"This action proceeds with the changes."})]})}},b={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"danger",onClick:()=>t(!0),children:"Delete Item"}),e.jsx(x,{isOpen:n,onClose:()=>t(!1),onConfirm:()=>{alert("Deleted!"),t(!1)},title:"Delete Item",description:"Removing the selected instances is permanent and cannot be undone.",confirmText:"Delete",cancelText:"Cancel",confirmVariant:"danger",infoLabel:"Item name",infoValue:"my-important-file.txt"})]})}},y={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Edit Profile"}),e.jsx(f,{isOpen:n,onClose:()=>t(!1),title:"Edit Profile",description:"Update your profile information.",children:e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(B,{label:"Name",children:e.jsx(N,{placeholder:"Enter your name",fullWidth:!0})}),e.jsx(B,{label:"Email",children:e.jsx(N,{type:"email",placeholder:"Enter your email",fullWidth:!0})}),e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)] mt-[var(--primitive-spacing-2)]",children:[e.jsx(o,{variant:"outline",onClick:()=>t(!1),fullWidth:!0,children:"Cancel"}),e.jsx(o,{onClick:()=>{alert("Saved!"),t(!1)},fullWidth:!0,children:"Save Changes"})]})]})})]})}},I={render:function(){const[n,t]=a.useState(!1),[r,i]=a.useState(!1),l=async()=>{i(!0),await new Promise(c=>setTimeout(c,2e3)),i(!1),t(!1)};return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Submit Action"}),e.jsx(x,{isOpen:n,onClose:()=>!r&&t(!1),onConfirm:l,title:"Submit",description:"This will submit the form.",confirmText:"Submit",isLoading:r})]})}},j={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"warning",onClick:()=>t(!0),children:"Reset Settings"}),e.jsx(x,{isOpen:n,onClose:()=>t(!1),onConfirm:()=>{alert("Settings reset!"),t(!1)},title:"Reset Settings",description:"This will reset all settings to their default values. Your current configuration will be lost.",confirmText:"Reset",cancelText:"Keep Current",confirmVariant:"warning"})]})}},M={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Modal"}),e.jsx(f,{isOpen:n,onClose:()=>t(!1),title:"Important Notice",description:"You must click a button to close this modal.",closeOnBackdropClick:!1,closeOnEscape:!1,children:e.jsx("div",{className:"flex gap-[var(--primitive-spacing-2)]",children:e.jsx(o,{variant:"outline",onClick:()=>t(!1),fullWidth:!0,children:"Got it"})})})]})}};var F,D,W;v.parameters={...v.parameters,docs:{...(F=v.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: function DefaultModal() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title" description="This is a description text that provides more context about the modal.">
          <div className="text-body-md text-[var(--color-text-default)]">
            Modal content goes here. You can put any content inside the modal.
          </div>
        </Modal>
      </>;
  }
}`,...(W=(D=v.parameters)==null?void 0:D.docs)==null?void 0:W.source}}};var L,V,R;O.parameters={...O.parameters,docs:{...(L=O.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: function ConfirmModalExample() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Confirm Modal</Button>
        <ConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => {
        alert('Confirmed!');
        setIsOpen(false);
      }} title="Confirm Action" description="This action proceeds with the changes." />
      </>;
  }
}`,...(R=(V=O.parameters)==null?void 0:V.docs)==null?void 0:R.source}}};var _,q,P;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: function DeleteConfirmExample() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Delete Item
        </Button>
        <ConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => {
        alert('Deleted!');
        setIsOpen(false);
      }} title="Delete Item" description="Removing the selected instances is permanent and cannot be undone." confirmText="Delete" cancelText="Cancel" confirmVariant="danger" infoLabel="Item name" infoValue="my-important-file.txt" />
      </>;
  }
}`,...(P=(q=b.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var A,Y,z;y.parameters={...y.parameters,docs:{...(A=y.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: function FormModal() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Edit Profile</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Profile" description="Update your profile information.">
          <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
            <FormField label="Name">
              <Input placeholder="Enter your name" fullWidth />
            </FormField>
            <FormField label="Email">
              <Input type="email" placeholder="Enter your email" fullWidth />
            </FormField>
            <div className="flex gap-[var(--primitive-spacing-2)] mt-[var(--primitive-spacing-2)]">
              <Button variant="outline" onClick={() => setIsOpen(false)} fullWidth>
                Cancel
              </Button>
              <Button onClick={() => {
              alert('Saved!');
              setIsOpen(false);
            }} fullWidth>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </>;
  }
}`,...(z=(Y=y.parameters)==null?void 0:Y.docs)==null?void 0:z.source}}};var K,G,U;I.parameters={...I.parameters,docs:{...(K=I.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: function LoadingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleConfirm = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsOpen(false);
    };
    return <>
        <Button onClick={() => setIsOpen(true)}>Submit Action</Button>
        <ConfirmModal isOpen={isOpen} onClose={() => !isLoading && setIsOpen(false)} onConfirm={handleConfirm} title="Submit" description="This will submit the form." confirmText="Submit" isLoading={isLoading} />
      </>;
  }
}`,...(U=(G=I.parameters)==null?void 0:G.docs)==null?void 0:U.source}}};var $,H,J;j.parameters={...j.parameters,docs:{...($=j.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: function WarningModal() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button variant="warning" onClick={() => setIsOpen(true)}>
          Reset Settings
        </Button>
        <ConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => {
        alert('Settings reset!');
        setIsOpen(false);
      }} title="Reset Settings" description="This will reset all settings to their default values. Your current configuration will be lost." confirmText="Reset" cancelText="Keep Current" confirmVariant="warning" />
      </>;
  }
}`,...(J=(H=j.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var Q,X,Z;M.parameters={...M.parameters,docs:{...(Q=M.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: function NoBackdropCloseModal() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Important Notice" description="You must click a button to close this modal." closeOnBackdropClick={false} closeOnEscape={false}>
          <div className="flex gap-[var(--primitive-spacing-2)]">
            <Button variant="outline" onClick={() => setIsOpen(false)} fullWidth>
              Got it
            </Button>
          </div>
        </Modal>
      </>;
  }
}`,...(Z=(X=M.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};const Me=["Default","Confirm","DeleteConfirm","WithForm","Loading","Warning","NoBackdropClose"];export{O as Confirm,v as Default,b as DeleteConfirm,I as Loading,M as NoBackdropClose,j as Warning,y as WithForm,Me as __namedExportsOrder,je as default};
