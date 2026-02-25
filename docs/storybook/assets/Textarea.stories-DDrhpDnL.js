import{r as u,j as e}from"./iframe-CsZHcOUf.js";import{t as Ye}from"./cn-CshvV4Tc.js";import{F as r}from"./FormField-DcPjmuus.js";import"./preload-helper-C1FmrZbK.js";const t=u.forwardRef(({variant:n="default",label:o,helperText:i,error:a,fullWidth:be=!1,showCount:ge=!1,maxLength:z,className:ye="",id:Fe,disabled:c,readOnly:p,value:W,defaultValue:R,required:je=!1,resize:Te="vertical",autoResize:we=!1,minRows:S=3,maxRows:C,success:ze,autosize:We,onChange:V,...q},Ve)=>{const d=Fe||`textarea-${Math.random().toString(36).substr(2,9)}`,Re=u.useRef(null),E=Ve||Re,s=we||We,Se=String(W??R??"").length,N=()=>{const l=E.current;if(!l||!s)return;l.style.height="auto";const D=parseInt(getComputedStyle(l).lineHeight)||20,M=parseInt(getComputedStyle(l).paddingTop)+parseInt(getComputedStyle(l).paddingBottom)||16,Ie=D*S+M,_e=C?D*C+M:1/0,Pe=Math.min(Math.max(l.scrollHeight,Ie),_e);l.style.height=`${Pe}px`};u.useEffect(()=>{s&&N()},[W,s]);const Ce=l=>{V==null||V(l),s&&N()},qe={none:"resize-none",vertical:"resize-y",horizontal:"resize-x",both:"resize"},Ee=["w-full","min-h-[var(--textarea-min-height)]","px-[var(--input-padding-x)]","py-[var(--input-padding-y)]","text-[length:var(--input-font-size)]","leading-[var(--input-line-height)]","bg-[var(--input-bg)]","text-[var(--color-text-default)]","border-[length:var(--input-border-width)]","border-solid","transition-all duration-[var(--duration-fast)]","placeholder:text-[var(--color-text-subtle)]","focus:outline-none"],Ne=p?[]:["focus:border-[var(--input-border-focus)]","focus:shadow-[0_0_0_1px_var(--input-border-focus)]"],De={default:"rounded-[var(--input-radius)]",code:"rounded-[var(--input-radius-code)] font-mono"},Me=()=>a?"border-[var(--input-border-error)]":ze?"border-[var(--color-state-success)]":p?"border-[var(--input-border-readonly)]":"border-[var(--input-border)]",Oe=c?"bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed border-transparent resize-none":"",Ae=p&&!c?"cursor-default":"",Le=Ye(Ee.join(" "),Ne.join(" "),De[n],Me(),Oe,Ae,!c&&!s&&qe[Te],s&&"resize-none overflow-hidden",ye),He=["flex flex-col gap-2",be?"w-full":"w-fit"].join(" ");return e.jsxs("div",{className:He,children:[o&&e.jsxs("label",{htmlFor:d,className:"text-label-lg text-[var(--color-text-default)]",children:[o,je&&e.jsx("span",{className:"text-[var(--color-state-danger)] ml-0.5",children:"*"})]}),i&&!a&&e.jsx("p",{id:`${d}-helper`,className:"text-body-sm text-[var(--color-text-subtle)]",children:i}),e.jsxs("div",{className:"relative h-fit",children:[e.jsx("textarea",{ref:E,id:d,className:Le,disabled:c,readOnly:p,maxLength:z,value:W,defaultValue:R,rows:s?S:q.rows,"aria-invalid":!!a,"aria-describedby":a?`${d}-error`:i?`${d}-helper`:void 0,onChange:Ce,...q}),ge&&z&&e.jsxs("div",{className:"absolute bottom-2 right-2 text-body-sm text-[var(--color-text-subtle)]",children:[Se,"/",z]})]}),a&&e.jsx("p",{id:`${d}-error`,className:"text-body-sm text-[var(--color-state-danger)]",children:a})]})});t.displayName="Textarea";t.__docgenInfo={description:"",methods:[],displayName:"Textarea",props:{variant:{required:!1,tsType:{name:"union",raw:"'default' | 'code'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'code'"}]},description:"Textarea variant",defaultValue:{value:"'default'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label text"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text"},error:{required:!1,tsType:{name:"string"},description:"Error message"},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Full width",defaultValue:{value:"false",computed:!1}},showCount:{required:!1,tsType:{name:"boolean"},description:"Show character count",defaultValue:{value:"false",computed:!1}},maxLength:{required:!1,tsType:{name:"number"},description:"Max character count"},required:{required:!1,tsType:{name:"boolean"},description:"Required field indicator",defaultValue:{value:"false",computed:!1}},resize:{required:!1,tsType:{name:"union",raw:"'none' | 'vertical' | 'horizontal' | 'both'",elements:[{name:"literal",value:"'none'"},{name:"literal",value:"'vertical'"},{name:"literal",value:"'horizontal'"},{name:"literal",value:"'both'"}]},description:"Resize behavior",defaultValue:{value:"'vertical'",computed:!1}},autoResize:{required:!1,tsType:{name:"boolean"},description:"Auto-resize based on content",defaultValue:{value:"false",computed:!1}},minRows:{required:!1,tsType:{name:"number"},description:"Minimum rows (when autoResize is true)",defaultValue:{value:"3",computed:!1}},maxRows:{required:!1,tsType:{name:"number"},description:"Maximum rows (when autoResize is true)"},success:{required:!1,tsType:{name:"boolean"},description:"@deprecated Use error for validation"},autosize:{required:!1,tsType:{name:"boolean"},description:"@deprecated Use autoResize instead"},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const Je={title:"Components/Textarea",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
## Textarea 컴포넌트

여러 줄 텍스트 입력을 위한 폼 컴포넌트입니다.

### 사용 시기
- 설명, 메모, 주석 등 긴 텍스트 입력
- YAML/JSON 등 코드 입력 (code variant)
- 자동 높이 조절이 필요한 경우

### Variant
- **default**: 일반 텍스트 입력
- **code**: 모노스페이스 폰트 (코드 편집용)

### Resize 옵션
- **none**: 크기 조절 불가
- **vertical**: 세로만 조절 (기본값)
- **horizontal**: 가로만 조절
- **both**: 양방향 조절

### 접근성
- aria-invalid, aria-describedby 자동 연결
- maxLength + showCount로 글자 수 제한 시각화

### 예시
\`\`\`tsx
import { Textarea } from '@thaki/tds';

// 기본 사용
<Textarea placeholder="Enter description..." fullWidth />

// FormField와 함께
<FormField label="Description" helperText="최대 500자">
  <Textarea placeholder="Enter description..." maxLength={500} showCount fullWidth />
</FormField>

// 코드 입력
<Textarea variant="code" placeholder="apiVersion: v1..." fullWidth />
\`\`\`
        `}}},argTypes:{variant:{control:"select",options:["default","code"],description:"스타일 변형",table:{type:{summary:'"default" | "code"'},defaultValue:{summary:'"default"'}}},resize:{control:"select",options:["none","vertical","horizontal","both"],description:"크기 조절 방향",table:{type:{summary:'"none" | "vertical" | "horizontal" | "both"'},defaultValue:{summary:'"vertical"'}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{defaultValue:{summary:"false"}}},readOnly:{control:"boolean",description:"읽기 전용 상태",table:{defaultValue:{summary:"false"}}},showCount:{control:"boolean",description:"글자 수 표시 (maxLength 필요)",table:{defaultValue:{summary:"false"}}},autoResize:{control:"boolean",description:"내용에 따라 자동 높이 조절",table:{defaultValue:{summary:"false"}}},error:{control:"text",description:"에러 메시지",table:{type:{summary:"string"}}}},args:{placeholder:"Enter text..."}},m={args:{placeholder:"Enter description...",fullWidth:!0},decorators:[n=>e.jsx("div",{style:{width:"400px"},children:e.jsx(n,{})})]},h={render:()=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{label:"Description",children:e.jsx(t,{placeholder:"Enter a detailed description...",fullWidth:!0})})})},x={render:()=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{label:"Notes",required:!0,children:e.jsx(t,{placeholder:"Enter notes...",fullWidth:!0})})})},f={render:()=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{label:"Description",helperText:"Provide a detailed description of the resource.",children:e.jsx(t,{placeholder:"Enter description...",fullWidth:!0})})})},v={render:function(){const[o,i]=u.useState("");return e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{label:"Bio",children:e.jsx(t,{placeholder:"Tell us about yourself...",value:o,onChange:a=>i(a.target.value),maxLength:200,showCount:!0,fullWidth:!0})})})}},b={render:()=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{label:"Description",errorMessage:"Description must be at least 20 characters.",error:!0,children:e.jsx(t,{defaultValue:"Too short",fullWidth:!0})})})},g={render:()=>e.jsx("div",{style:{width:"500px"},children:e.jsx(r,{label:"YAML Configuration",children:e.jsx(t,{variant:"code",defaultValue:`apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80`,fullWidth:!0})})})},y={render:function(){const[o,i]=u.useState("Type here and watch the textarea grow...");return e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{label:"Auto-resize Textarea",helperText:"높이가 내용에 따라 자동 조절됩니다 (최소 2줄, 최대 10줄)",children:e.jsx(t,{value:o,onChange:a=>i(a.target.value),autoResize:!0,minRows:2,maxRows:10,fullWidth:!0})})})}},F={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",style:{width:"400px"},children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:'resize="none"'}),e.jsx(t,{placeholder:"Cannot resize",resize:"none",fullWidth:!0})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:'resize="vertical" (default)'}),e.jsx(t,{placeholder:"Vertical resize only",resize:"vertical",fullWidth:!0})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:'resize="both"'}),e.jsx(t,{placeholder:"Resize in any direction",resize:"both",fullWidth:!0})]})]})},j={render:()=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{label:"Disabled Textarea",children:e.jsx(t,{defaultValue:"This textarea is disabled.",disabled:!0,fullWidth:!0})})})},T={render:()=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{label:"Read Only",children:e.jsx(t,{defaultValue:"This content is read-only. You can select and copy the text but cannot edit it.",readOnly:!0,fullWidth:!0})})})},w={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",style:{width:"400px"},children:[e.jsx(r,{label:"Default",children:e.jsx(t,{placeholder:"Default state",fullWidth:!0})}),e.jsx(r,{label:"With Value",children:e.jsx(t,{defaultValue:"Some content here",fullWidth:!0})}),e.jsx(r,{label:"Disabled",children:e.jsx(t,{defaultValue:"Disabled content",disabled:!0,fullWidth:!0})}),e.jsx(r,{label:"Read Only",children:e.jsx(t,{defaultValue:"Read only content",readOnly:!0,fullWidth:!0})}),e.jsx(r,{label:"Error",errorMessage:"This field has an error",error:!0,children:e.jsx(t,{defaultValue:"Invalid",fullWidth:!0})}),e.jsx(r,{label:"Code",children:e.jsx(t,{variant:"code",defaultValue:"const x = 42;",fullWidth:!0})})]})};var O,A,L;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter description...',
    fullWidth: true
  },
  decorators: [Story => <div style={{
    width: '400px'
  }}>
        <Story />
      </div>]
}`,...(L=(A=m.parameters)==null?void 0:A.docs)==null?void 0:L.source}}};var H,I,_;h.parameters={...h.parameters,docs:{...(H=h.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '400px'
  }}>
      <FormField label="Description">
        <Textarea placeholder="Enter a detailed description..." fullWidth />
      </FormField>
    </div>
}`,...(_=(I=h.parameters)==null?void 0:I.docs)==null?void 0:_.source}}};var P,Y,$;x.parameters={...x.parameters,docs:{...(P=x.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '400px'
  }}>
      <FormField label="Notes" required>
        <Textarea placeholder="Enter notes..." fullWidth />
      </FormField>
    </div>
}`,...($=(Y=x.parameters)==null?void 0:Y.docs)==null?void 0:$.source}}};var B,k,U;f.parameters={...f.parameters,docs:{...(B=f.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '400px'
  }}>
      <FormField label="Description" helperText="Provide a detailed description of the resource.">
        <Textarea placeholder="Enter description..." fullWidth />
      </FormField>
    </div>
}`,...(U=(k=f.parameters)==null?void 0:k.docs)==null?void 0:U.source}}};var J,G,K;v.parameters={...v.parameters,docs:{...(J=v.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: function CharacterCountExample() {
    const [value, setValue] = useState('');
    return <div style={{
      width: '400px'
    }}>
        <FormField label="Bio">
          <Textarea placeholder="Tell us about yourself..." value={value} onChange={e => setValue(e.target.value)} maxLength={200} showCount fullWidth />
        </FormField>
      </div>;
  }
}`,...(K=(G=v.parameters)==null?void 0:G.docs)==null?void 0:K.source}}};var Q,X,Z;b.parameters={...b.parameters,docs:{...(Q=b.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '400px'
  }}>
      <FormField label="Description" errorMessage="Description must be at least 20 characters." error>
        <Textarea defaultValue="Too short" fullWidth />
      </FormField>
    </div>
}`,...(Z=(X=b.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,te,re;g.parameters={...g.parameters,docs:{...(ee=g.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '500px'
  }}>
      <FormField label="YAML Configuration">
        <Textarea variant="code" defaultValue={\`apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80\`} fullWidth />
      </FormField>
    </div>
}`,...(re=(te=g.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var ae,le,ie;y.parameters={...y.parameters,docs:{...(ae=y.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: function AutoResizeExample() {
    const [value, setValue] = useState('Type here and watch the textarea grow...');
    return <div style={{
      width: '400px'
    }}>
        <FormField label="Auto-resize Textarea" helperText="높이가 내용에 따라 자동 조절됩니다 (최소 2줄, 최대 10줄)">
          <Textarea value={value} onChange={e => setValue(e.target.value)} autoResize minRows={2} maxRows={10} fullWidth />
        </FormField>
      </div>;
  }
}`,...(ie=(le=y.parameters)==null?void 0:le.docs)==null?void 0:ie.source}}};var se,oe,de;F.parameters={...F.parameters,docs:{...(se=F.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]" style={{
    width: '400px'
  }}>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          resize=&quot;none&quot;
        </p>
        <Textarea placeholder="Cannot resize" resize="none" fullWidth />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          resize=&quot;vertical&quot; (default)
        </p>
        <Textarea placeholder="Vertical resize only" resize="vertical" fullWidth />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          resize=&quot;both&quot;
        </p>
        <Textarea placeholder="Resize in any direction" resize="both" fullWidth />
      </div>
    </div>
}`,...(de=(oe=F.parameters)==null?void 0:oe.docs)==null?void 0:de.source}}};var ne,ue,ce;j.parameters={...j.parameters,docs:{...(ne=j.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '400px'
  }}>
      <FormField label="Disabled Textarea">
        <Textarea defaultValue="This textarea is disabled." disabled fullWidth />
      </FormField>
    </div>
}`,...(ce=(ue=j.parameters)==null?void 0:ue.docs)==null?void 0:ce.source}}};var pe,me,he;T.parameters={...T.parameters,docs:{...(pe=T.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '400px'
  }}>
      <FormField label="Read Only">
        <Textarea defaultValue="This content is read-only. You can select and copy the text but cannot edit it." readOnly fullWidth />
      </FormField>
    </div>
}`,...(he=(me=T.parameters)==null?void 0:me.docs)==null?void 0:he.source}}};var xe,fe,ve;w.parameters={...w.parameters,docs:{...(xe=w.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]" style={{
    width: '400px'
  }}>
      <FormField label="Default">
        <Textarea placeholder="Default state" fullWidth />
      </FormField>
      <FormField label="With Value">
        <Textarea defaultValue="Some content here" fullWidth />
      </FormField>
      <FormField label="Disabled">
        <Textarea defaultValue="Disabled content" disabled fullWidth />
      </FormField>
      <FormField label="Read Only">
        <Textarea defaultValue="Read only content" readOnly fullWidth />
      </FormField>
      <FormField label="Error" errorMessage="This field has an error" error>
        <Textarea defaultValue="Invalid" fullWidth />
      </FormField>
      <FormField label="Code">
        <Textarea variant="code" defaultValue="const x = 42;" fullWidth />
      </FormField>
    </div>
}`,...(ve=(fe=w.parameters)==null?void 0:fe.docs)==null?void 0:ve.source}}};const Ge=["Default","WithLabel","Required","WithHelperText","WithCharacterCount","WithError","CodeVariant","AutoResize","ResizeOptions","Disabled","ReadOnly","AllStates"];export{w as AllStates,y as AutoResize,g as CodeVariant,m as Default,j as Disabled,T as ReadOnly,x as Required,F as ResizeOptions,v as WithCharacterCount,b as WithError,f as WithHelperText,h as WithLabel,Ge as __namedExportsOrder,Je as default};
