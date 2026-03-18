import{j as e,r as z}from"./iframe-BkR05wRD.js";import{T as a}from"./Toggle-BEWd4kkL.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";const I={title:"Components/Toggle",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
## Toggle 컴포넌트

ON/OFF 두 가지 상태를 전환하는 스위치 컴포넌트입니다.

### 사용 시기
- 설정 켜기/끄기
- 기능 활성화/비활성화
- 즉시 적용되는 설정 변경

### Checkbox vs Toggle
| | Checkbox | Toggle |
|---|---|---|
| **사용 시점** | 폼 제출 시 적용 | 즉시 적용 |
| **다중 선택** | 가능 | 단일 설정 |
| **시각적 피드백** | 체크 마크 | 슬라이드 애니메이션 |

### 접근성
- \`role="switch"\` 적용
- 키보드(Space)로 토글 가능
- 스크린리더에 ON/OFF 상태 전달

### 예시
\`\`\`tsx
import { Toggle } from '@thaki/tds';

// 기본 사용
<Toggle label="알림 켜기" />

// Controlled
<Toggle 
  checked={enabled} 
  onChange={(e) => setEnabled(e.target.checked)}
  label="다크 모드"
/>

// 설명 포함
<Toggle 
  label="자동 저장"
  description="변경사항을 자동으로 저장합니다"
/>
\`\`\`
        `}}},argTypes:{label:{control:"text",description:"토글 라벨",table:{type:{summary:"string"}}},description:{control:"text",description:"라벨 아래 설명 텍스트",table:{type:{summary:"string"}}},checked:{control:"boolean",description:"토글 상태 (controlled)",table:{type:{summary:"boolean"}}},defaultChecked:{control:"boolean",description:"초기 토글 상태 (uncontrolled)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},size:{control:"select",options:["sm","md","lg"],description:"토글 크기",table:{type:{summary:'"sm" | "md" | "lg"'},defaultValue:{summary:'"md"'}}}}},l={args:{label:"Toggle label"}},r={args:{label:"Enabled",defaultChecked:!0}},o={args:{label:"Dark mode",description:"Switch between light and dark theme"}},n={args:{}},i={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(a,{label:"Disabled off",disabled:!0}),e.jsx(a,{label:"Disabled on",disabled:!0,defaultChecked:!0})]})},d={render:function(){const[s,g]=z.useState(!1);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(a,{label:"Notifications",checked:s,onChange:t=>g(t.target.checked)}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Status: ",e.jsx("strong",{children:s?"Enabled":"Disabled"})]})]})}},c={render:function(){const[s,g]=z.useState({notifications:!0,darkMode:!1,autoSave:!0,analytics:!1}),t=p=>{g(u=>({...u,[p]:!u[p]}))};return e.jsxs("div",{className:"w-[320px] flex flex-col gap-[var(--primitive-spacing-4)] p-[var(--primitive-spacing-4)] bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)]",children:[e.jsx("h3",{className:"text-heading-h6",children:"Settings"}),e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)]",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md",children:"Push notifications"}),e.jsx(a,{checked:s.notifications,onChange:()=>t("notifications")})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md",children:"Dark mode"}),e.jsx(a,{checked:s.darkMode,onChange:()=>t("darkMode")})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md",children:"Auto-save"}),e.jsx(a,{checked:s.autoSave,onChange:()=>t("autoSave")})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md",children:"Analytics"}),e.jsx(a,{checked:s.analytics,onChange:()=>t("analytics")})]})]})]})}},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(a,{label:"Default (off)"}),e.jsx(a,{label:"Default (on)",defaultChecked:!0}),e.jsx(a,{label:"Disabled (off)",disabled:!0}),e.jsx(a,{label:"Disabled (on)",disabled:!0,defaultChecked:!0}),e.jsx(a,{label:"With description",description:"This is a helpful description text."})]})};var b,f,h;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: 'Toggle label'
  }
}`,...(h=(f=l.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};var x,v,y;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: 'Enabled',
    defaultChecked: true
  }
}`,...(y=(v=r.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var k,j,C;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: 'Dark mode',
    description: 'Switch between light and dark theme'
  }
}`,...(C=(j=o.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var N,S,T;n.parameters={...n.parameters,docs:{...(N=n.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {}
}`,...(T=(S=n.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var D,w,E;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Toggle label="Disabled off" disabled />
      <Toggle label="Disabled on" disabled defaultChecked />
    </div>
}`,...(E=(w=i.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var A,M,W;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: function ControlledToggle() {
    const [enabled, setEnabled] = useState(false);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <Toggle label="Notifications" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
        <p className="text-body-md text-[var(--color-text-muted)]">
          Status: <strong>{enabled ? 'Enabled' : 'Disabled'}</strong>
        </p>
      </div>;
  }
}`,...(W=(M=d.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};var O,F,V;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: function SettingsExample() {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false
    });
    const handleChange = (key: keyof typeof settings) => {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };
    return <div className="w-[320px] flex flex-col gap-[var(--primitive-spacing-4)] p-[var(--primitive-spacing-4)] bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)]">
        <h3 className="text-heading-h6">Settings</h3>

        <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
          <div className="flex items-center justify-between">
            <span className="text-body-md">Push notifications</span>
            <Toggle checked={settings.notifications} onChange={() => handleChange('notifications')} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body-md">Dark mode</span>
            <Toggle checked={settings.darkMode} onChange={() => handleChange('darkMode')} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body-md">Auto-save</span>
            <Toggle checked={settings.autoSave} onChange={() => handleChange('autoSave')} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body-md">Analytics</span>
            <Toggle checked={settings.analytics} onChange={() => handleChange('analytics')} />
          </div>
        </div>
      </div>;
  }
}`,...(V=(F=c.parameters)==null?void 0:F.docs)==null?void 0:V.source}}};var L,P,_;m.parameters={...m.parameters,docs:{...(L=m.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Toggle label="Default (off)" />
      <Toggle label="Default (on)" defaultChecked />
      <Toggle label="Disabled (off)" disabled />
      <Toggle label="Disabled (on)" disabled defaultChecked />
      <Toggle label="With description" description="This is a helpful description text." />
    </div>
}`,...(_=(P=m.parameters)==null?void 0:P.docs)==null?void 0:_.source}}};const J=["Default","Checked","WithDescription","WithoutLabel","Disabled","Controlled","SettingsExample","AllStates"];export{m as AllStates,r as Checked,d as Controlled,l as Default,i as Disabled,c as SettingsExample,o as WithDescription,n as WithoutLabel,J as __namedExportsOrder,I as default};
