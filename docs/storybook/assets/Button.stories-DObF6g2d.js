import{j as r}from"./iframe-CzLct1Ct.js";import{B as a}from"./Button-kAA1kjx0.js";import{I as S}from"./IconPlus-Bx9Ryng2.js";import{I as Vr}from"./IconEdit-C4TPH2hK.js";import{I as Cr}from"./IconTrash-oozeluA6.js";import{I as j}from"./IconDownload-BOd9ddwU.js";import{I as Gr}from"./IconCheck-Dy71EyJ1.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./createReactComponent-Djx9unWR.js";const Kr={title:"Components/Button",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
## Button 컴포넌트

사용자 액션을 트리거하는 기본 버튼 컴포넌트입니다.

### 사용 시기
- **Primary**: 페이지의 주요 액션 (저장, 제출, 확인)
- **Secondary**: 보조 액션 (취소, 뒤로가기)
- **Outline**: 덜 강조되는 액션
- **Ghost**: 텍스트처럼 보이지만 클릭 가능한 영역이 필요할 때
- **Danger**: 삭제, 제거 등 위험한 액션
- **Warning**: 주의가 필요한 비파괴적 액션 (Force Restart, Suspend 등)
- **Link**: 내부 페이지로 이동
- **Anchor Link**: 외부 링크 (새 탭에서 열림)

### 사이즈 가이드라인

| 사이즈 | 높이 | 권장 사용처 |
|--------|------|------------|
| **SM** | 28px | 테이블 툴바, 밀집된 UI, 반복 가능한 보조 액션 |
| **MD** | 32px | 일반 폼, 모달/드로어 액션, 독립적인 CTA |
| **LG** | 36px | 페이지 주요 CTA, 랜딩 페이지, 히어로 섹션 |

#### 판단 기준
1. **밀집된 UI인가?** → SM
2. **독립적인 CTA인가?** → MD/LG
3. **반복 가능한 액션인가?** → SM
4. **폼의 최종 제출인가?** → MD/LG

#### 수직 정렬 원칙
같은 행에 있는 요소는 같은 사이즈를 사용하세요:
- \`Input md (32px)\` + \`Button md (32px)\` ✓
- \`SearchInput sm (28px)\` + \`Button sm (28px)\` ✓
- \`Input md (32px)\` + \`Button sm (28px)\` ✗ 높이 불일치

### 접근성
- 아이콘만 있는 버튼은 반드시 \`aria-label\` 제공
- 로딩 중일 때 스크린리더에 상태 전달
- 키보드(Enter, Space)로 활성화 가능

### 예시
\`\`\`tsx
import { Button } from '@thaki/tds';

// 기본 사용
<Button variant="primary">저장</Button>

// 아이콘 포함
<Button leftIcon={<IconPlus />}>추가</Button>

// 아이콘만
<Button icon={<IconTrash />} aria-label="삭제" variant="danger" />
\`\`\`
        `}}},argTypes:{variant:{control:"select",options:["primary","secondary","outline","ghost","muted","danger","warning","link"],description:"버튼 스타일 변형",table:{type:{summary:"string"},defaultValue:{summary:"primary"}}},size:{control:"select",options:["xs","sm","md","lg"],description:"버튼 크기 (xs: 24px, sm: 28px, md: 32px, lg: 40px)",table:{type:{summary:"string"},defaultValue:{summary:"md"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},isLoading:{control:"boolean",description:"로딩 상태 (스피너 표시)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},leftIcon:{description:"버튼 텍스트 왼쪽에 표시할 아이콘",table:{type:{summary:"ReactNode"}}},rightIcon:{description:"버튼 텍스트 오른쪽에 표시할 아이콘",table:{type:{summary:"ReactNode"}}},icon:{description:"아이콘만 표시 (텍스트 없음, aria-label 필수)",table:{type:{summary:"ReactNode"}}},as:{description:'렌더링할 HTML 요소 ("button" 또는 "a")',table:{type:{summary:'"button" | "a"'},defaultValue:{summary:'"button"'}}}},args:{children:"Button",variant:"primary",size:"md"}},e={args:{variant:"primary",children:"Primary Button"}},n={args:{variant:"secondary",children:"Secondary Button"}},t={args:{variant:"outline",children:"Outline Button"}},s={args:{variant:"ghost",children:"Ghost Button"}},o={args:{variant:"muted",children:"Muted Button"}},i={args:{variant:"danger",children:"Danger Button"}},c={args:{variant:"warning",children:"Warning Button"}},d={args:{variant:"link",children:"Link Button"}},l={render:()=>r.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[r.jsx(a,{size:"xs",children:"Extra Small"}),r.jsx(a,{size:"sm",children:"Small"}),r.jsx(a,{size:"md",children:"Medium"}),r.jsx(a,{size:"lg",children:"Large"})]})},u={render:()=>r.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-4)]",children:[r.jsx(a,{variant:"primary",children:"Primary"}),r.jsx(a,{variant:"secondary",children:"Secondary"}),r.jsx(a,{variant:"outline",children:"Outline"}),r.jsx(a,{variant:"ghost",children:"Ghost"}),r.jsx(a,{variant:"muted",children:"Muted"}),r.jsx(a,{variant:"danger",children:"Danger"}),r.jsx(a,{variant:"warning",children:"Warning"}),r.jsx(a,{variant:"link",children:"Link"})]})},m={args:{leftIcon:r.jsx(S,{size:12}),children:"Add Item"}},p={args:{rightIcon:r.jsx(j,{size:12}),children:"Download"}},g={args:{leftIcon:r.jsx(Gr,{size:12}),rightIcon:r.jsx(j,{size:12}),children:"Confirm & Download"}},h={args:{icon:r.jsx(S,{size:12}),"aria-label":"Add item",variant:"secondary"}},v={render:()=>r.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[r.jsx(a,{icon:r.jsx(S,{size:12}),"aria-label":"Add",variant:"primary"}),r.jsx(a,{icon:r.jsx(Vr,{size:12}),"aria-label":"Edit",variant:"secondary"}),r.jsx(a,{icon:r.jsx(Cr,{size:12}),"aria-label":"Delete",variant:"danger"}),r.jsx(a,{icon:r.jsx(j,{size:12}),"aria-label":"Download",variant:"ghost"})]})},x={args:{isLoading:!0,children:"Loading..."}},y={args:{disabled:!0,children:"Disabled"}},B={render:()=>r.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-4)]",children:[r.jsx(a,{variant:"primary",disabled:!0,children:"Primary"}),r.jsx(a,{variant:"secondary",disabled:!0,children:"Secondary"}),r.jsx(a,{variant:"outline",disabled:!0,children:"Outline"}),r.jsx(a,{variant:"ghost",disabled:!0,children:"Ghost"}),r.jsx(a,{variant:"danger",disabled:!0,children:"Danger"})]})},b={args:{fullWidth:!0,children:"Full Width Button"},decorators:[Pr=>r.jsx("div",{style:{width:"300px"},children:r.jsx(Pr,{})})]},I={args:{as:"a",href:"https://example.com",target:"_blank",children:"Visit Website"}},f={args:{children:"Click me",onClick:()=>alert("Button clicked!")}};var z,D,k;e.parameters={...e.parameters,docs:{...(z=e.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...(k=(D=e.parameters)==null?void 0:D.docs)==null?void 0:k.source}}};var L,W,w;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...(w=(W=n.parameters)==null?void 0:W.docs)==null?void 0:w.source}}};var M,A,O;t.parameters={...t.parameters,docs:{...(M=t.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    children: 'Outline Button'
  }
}`,...(O=(A=t.parameters)==null?void 0:A.docs)==null?void 0:O.source}}};var P,V,C;s.parameters={...s.parameters,docs:{...(P=s.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    children: 'Ghost Button'
  }
}`,...(C=(V=s.parameters)==null?void 0:V.docs)==null?void 0:C.source}}};var G,N,E;o.parameters={...o.parameters,docs:{...(G=o.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    variant: 'muted',
    children: 'Muted Button'
  }
}`,...(E=(N=o.parameters)==null?void 0:N.docs)==null?void 0:E.source}}};var T,R,F;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger Button'
  }
}`,...(F=(R=i.parameters)==null?void 0:R.docs)==null?void 0:F.source}}};var _,U,H;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning Button'
  }
}`,...(H=(U=c.parameters)==null?void 0:U.docs)==null?void 0:H.source}}};var q,J,K;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    variant: 'link',
    children: 'Link Button'
  }
}`,...(K=(J=d.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,X,Y;l.parameters={...l.parameters,docs:{...(Q=l.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
}`,...(Y=(X=l.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,$,rr;u.parameters={...u.parameters,docs:{...(Z=u.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-[var(--primitive-spacing-4)]">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="link">Link</Button>
    </div>
}`,...(rr=($=u.parameters)==null?void 0:$.docs)==null?void 0:rr.source}}};var ar,er,nr;m.parameters={...m.parameters,docs:{...(ar=m.parameters)==null?void 0:ar.docs,source:{originalSource:`{
  args: {
    leftIcon: <IconPlus size={12} />,
    children: 'Add Item'
  }
}`,...(nr=(er=m.parameters)==null?void 0:er.docs)==null?void 0:nr.source}}};var tr,sr,or;p.parameters={...p.parameters,docs:{...(tr=p.parameters)==null?void 0:tr.docs,source:{originalSource:`{
  args: {
    rightIcon: <IconDownload size={12} />,
    children: 'Download'
  }
}`,...(or=(sr=p.parameters)==null?void 0:sr.docs)==null?void 0:or.source}}};var ir,cr,dr;g.parameters={...g.parameters,docs:{...(ir=g.parameters)==null?void 0:ir.docs,source:{originalSource:`{
  args: {
    leftIcon: <IconCheck size={12} />,
    rightIcon: <IconDownload size={12} />,
    children: 'Confirm & Download'
  }
}`,...(dr=(cr=g.parameters)==null?void 0:cr.docs)==null?void 0:dr.source}}};var lr,ur,mr;h.parameters={...h.parameters,docs:{...(lr=h.parameters)==null?void 0:lr.docs,source:{originalSource:`{
  args: {
    icon: <IconPlus size={12} />,
    'aria-label': 'Add item',
    variant: 'secondary'
  }
}`,...(mr=(ur=h.parameters)==null?void 0:ur.docs)==null?void 0:mr.source}}};var pr,gr,hr;v.parameters={...v.parameters,docs:{...(pr=v.parameters)==null?void 0:pr.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <Button icon={<IconPlus size={12} />} aria-label="Add" variant="primary" />
      <Button icon={<IconEdit size={12} />} aria-label="Edit" variant="secondary" />
      <Button icon={<IconTrash size={12} />} aria-label="Delete" variant="danger" />
      <Button icon={<IconDownload size={12} />} aria-label="Download" variant="ghost" />
    </div>
}`,...(hr=(gr=v.parameters)==null?void 0:gr.docs)==null?void 0:hr.source}}};var vr,xr,yr;x.parameters={...x.parameters,docs:{...(vr=x.parameters)==null?void 0:vr.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    children: 'Loading...'
  }
}`,...(yr=(xr=x.parameters)==null?void 0:xr.docs)==null?void 0:yr.source}}};var Br,br,Ir;y.parameters={...y.parameters,docs:{...(Br=y.parameters)==null?void 0:Br.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled'
  }
}`,...(Ir=(br=y.parameters)==null?void 0:br.docs)==null?void 0:Ir.source}}};var fr,Sr,jr;B.parameters={...B.parameters,docs:{...(fr=B.parameters)==null?void 0:fr.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-[var(--primitive-spacing-4)]">
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
      <Button variant="danger" disabled>
        Danger
      </Button>
    </div>
}`,...(jr=(Sr=B.parameters)==null?void 0:Sr.docs)==null?void 0:jr.source}}};var zr,Dr,kr;b.parameters={...b.parameters,docs:{...(zr=b.parameters)==null?void 0:zr.docs,source:{originalSource:`{
  args: {
    fullWidth: true,
    children: 'Full Width Button'
  },
  decorators: [Story => <div style={{
    width: '300px'
  }}>
        <Story />
      </div>]
}`,...(kr=(Dr=b.parameters)==null?void 0:Dr.docs)==null?void 0:kr.source}}};var Lr,Wr,wr;I.parameters={...I.parameters,docs:{...(Lr=I.parameters)==null?void 0:Lr.docs,source:{originalSource:`{
  args: {
    as: 'a',
    href: 'https://example.com',
    target: '_blank',
    children: 'Visit Website'
  }
}`,...(wr=(Wr=I.parameters)==null?void 0:Wr.docs)==null?void 0:wr.source}}};var Mr,Ar,Or;f.parameters={...f.parameters,docs:{...(Mr=f.parameters)==null?void 0:Mr.docs,source:{originalSource:`{
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!')
  }
}`,...(Or=(Ar=f.parameters)==null?void 0:Ar.docs)==null?void 0:Or.source}}};const Qr=["Primary","Secondary","Outline","Ghost","Muted","Danger","Warning","Link","Sizes","AllVariants","WithLeftIcon","WithRightIcon","WithBothIcons","IconOnly","IconOnlyVariants","Loading","Disabled","DisabledVariants","FullWidth","AsLink","Interactive"];export{u as AllVariants,I as AsLink,i as Danger,y as Disabled,B as DisabledVariants,b as FullWidth,s as Ghost,h as IconOnly,v as IconOnlyVariants,f as Interactive,d as Link,x as Loading,o as Muted,t as Outline,e as Primary,n as Secondary,l as Sizes,c as Warning,g as WithBothIcons,m as WithLeftIcon,p as WithRightIcon,Qr as __namedExportsOrder,Kr as default};
