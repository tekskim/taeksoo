import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { WizardPatternSection } from '../../design-system-sections/WizardPatternSection';

export function WizardPage() {
  return (
    <ComponentPageTemplate
      title="Wizard (Create Flow)"
      description="Multi-step wizard pattern for resource creation with section status management"
      examples={<WizardPatternSection />}
      relatedLinks={[
        {
          label: 'Multi Tab Create',
          path: '/design/patterns/multi-tab-create',
          description: 'Tab-based creation for complex forms',
        },
        {
          label: 'Section card',
          path: '/design/components/section-card',
          description: 'Input card container',
        },
        {
          label: 'Floating card',
          path: '/design/components/floating-card',
          description: 'Summary and quota sidebar',
        },
        {
          label: 'Common patterns',
          path: '/design/patterns/common',
          description: 'Pattern selection guide',
        },
      ]}
    />
  );
}
