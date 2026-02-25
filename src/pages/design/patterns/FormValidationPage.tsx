import { VStack } from '@/design-system';
import { DocSection } from '../_shared/DocSection';
import { CodeBlock } from '../_shared/CodeBlock';

export function FormValidationPage() {
  return (
    <VStack gap={10} align="stretch">
      <VStack gap={2} align="start">
        <h2 className="text-heading-h3 text-[var(--color-text-default)]">Form validation</h2>
        <p className="text-body-lg text-[var(--color-text-muted)]">
          TDS의 폼 검증 패턴, 에러 표시, Drawer 폼 검증, 위자드 섹션 검증 가이드
        </p>
      </VStack>

      <DocSection
        id="overview"
        title="Validation strategy"
        description="TDS는 외부 폼 라이브러리 없이 커스텀 상태 관리 기반 검증을 사용합니다"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-body-md text-[var(--color-text-default)]">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                {['Timing', 'Pattern', 'Where'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  t: 'Next button click',
                  p: 'validateSection() → fail → return',
                  w: 'Wizard create pages',
                },
                {
                  t: 'Submit button click',
                  p: 'hasAttemptedSubmit flag → validate',
                  w: 'Drawer forms',
                },
                { t: 'On value change', p: 'setError(null) — clear only', w: 'All forms' },
                { t: 'Real-time validation', p: 'Not used', w: '—' },
              ].map((r) => (
                <tr key={r.t} className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 px-3 text-label-md">{r.t}</td>
                  <td className="py-2 px-3 font-mono text-body-sm">{r.p}</td>
                  <td className="py-2 px-3 text-body-sm text-[var(--color-text-muted)]">{r.w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        id="field-validation"
        title="Field-level validation"
        description="각 필드에 대해 개별 에러 상태를 관리하는 패턴"
      >
        <CodeBlock
          code={`// 1. 필드별 에러 state
const [nameError, setNameError] = useState<string | null>(null);
const [azError, setAzError] = useState<string | null>(null);

// 2. 검증 함수
const validateBasicInfo = () => {
  let hasError = false;
  if (!name.trim()) {
    setNameError('Please enter a name.');
    hasError = true;
  } else {
    setNameError(null);
  }
  if (!az) {
    setAzError('Please select an availability zone.');
    hasError = true;
  } else {
    setAzError(null);
  }
  return !hasError;
};

// 3. FormField에 에러 전달
<FormField label="Name" error={!!nameError} required>
  <Input
    value={name}
    onChange={(e) => { setName(e.target.value); setNameError(null); }}
    fullWidth
  />
  {nameError && <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>}
</FormField>`}
          language="tsx"
        />
      </DocSection>

      <DocSection
        id="section-validation"
        title="Section-level validation (Wizard)"
        description="위자드에서 다음 섹션 이동 전 현재 섹션을 검증하는 패턴"
      >
        <VStack gap={4} align="stretch">
          <CodeBlock
            code={`const goToNextSection = (currentSection: SectionStep) => {
  let isValid = true;
  if (currentSection === 'basic-info') isValid = validateBasicInfo();
  else if (currentSection === 'source') isValid = validateSource();
  else if (currentSection === 'configuration') isValid = validateConfiguration();

  if (!isValid) return; // 검증 실패 → 이동 안 함

  setSectionStatus((prev) => ({
    ...prev,
    [currentSection]: 'done',
    [nextSection]: 'active',
  }));
};`}
            language="tsx"
          />
          <p className="text-body-md text-[var(--color-text-muted)]">
            각 섹션 컴포넌트 내부에서도 <code className="text-body-sm">handleNextClick</code>에서
            자체 검증 후 <code className="text-body-sm">onNext()</code>를 호출하는 패턴도
            사용됩니다.
          </p>
        </VStack>
      </DocSection>

      <DocSection
        id="drawer-validation"
        title="Drawer form validation"
        description="hasAttemptedSubmit 패턴으로 최초 Submit 이후에만 에러를 표시합니다"
      >
        <VStack gap={4} align="stretch">
          <CodeBlock
            code={`const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
const [nameError, setNameError] = useState<string | null>(null);

// Drawer 열릴 때 초기화
useEffect(() => {
  if (isOpen) {
    setHasAttemptedSubmit(false);
    setNameError(null);
    // 기존 값으로 폼 초기화
    setName(resource?.name ?? '');
  }
}, [isOpen, resource]);

// Submit
const handleSubmit = async () => {
  setHasAttemptedSubmit(true);
  if (!name.trim()) {
    setNameError('Name is required');
    return;
  }
  setNameError(null);
  await onSubmit(name);
  onClose();
};

// Close — 에러 초기화
const handleClose = () => {
  setHasAttemptedSubmit(false);
  setNameError(null);
  onClose();
};`}
            language="tsx"
          />

          <CodeBlock
            code={`// 에러는 hasAttemptedSubmit 이후에만 표시
<FormField error={hasAttemptedSubmit && !!nameError}>
  <FormField.Label>Name</FormField.Label>
  <FormField.Control>
    <Input
      value={name}
      onChange={(e) => { setName(e.target.value); if (hasAttemptedSubmit) setNameError(null); }}
      error={hasAttemptedSubmit && !!nameError}
      fullWidth
    />
  </FormField.Control>
  <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
</FormField>`}
            language="tsx"
          />
        </VStack>
      </DocSection>

      <DocSection
        id="drawer-structure"
        title="Drawer form structure"
        description="Edit Drawer의 전체 구조 패턴"
      >
        <CodeBlock
          code={`<Drawer
  isOpen={isOpen}
  onClose={handleClose}
  title=""
  showCloseButton={false}
  width={360}     // 4col: 360, 8col: 696, 12col: 1032
  footer={
    <HStack gap={2} className="w-full">
      <Button variant="secondary" onClick={handleClose} className="flex-1">Cancel</Button>
      <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </HStack>
  }
>
  <VStack gap={6}>
    <h2 className="text-heading-h5 text-[var(--color-text-default)]">Edit Resource</h2>

    {/* Context info */}
    <InfoBox label="Resource ID" value={resourceId} />

    {/* Form fields */}
    <FormField label="Name" error={hasAttemptedSubmit && !!nameError} required>
      <Input value={name} onChange={...} fullWidth />
      {nameError && <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>}
    </FormField>
  </VStack>
</Drawer>`}
          language="tsx"
        />
      </DocSection>

      <DocSection id="confirm-modal" title="Confirmation modal" description="삭제/확인 모달 패턴">
        <VStack gap={4} align="stretch">
          <CodeBlock
            code={`// ConfirmModal (간편 컴포넌트)
<ConfirmModal
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Delete Resource"
  description="This action cannot be undone."
  infoLabel="Resource name"
  infoValue={resourceName}
  confirmText="Delete"
  confirmVariant="danger"
/>

// 또는 Manual Modal
<Modal isOpen={isOpen} onClose={handleClose} title="Delete Resource" size="sm">
  <InfoBox label="Resource name" value={resourceName} />
  <div className="flex gap-2 w-full">
    <Button variant="secondary" onClick={handleClose} className="flex-1">Cancel</Button>
    <Button variant="danger" onClick={handleConfirm} className="flex-1">Delete</Button>
  </div>
</Modal>`}
            language="tsx"
          />
        </VStack>
      </DocSection>
    </VStack>
  );
}
