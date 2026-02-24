import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ColorSwatch, Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function PrimitiveColorsPage() {
  return (
    <ComponentPageTemplate
      title="Primitive colors"
      description="Core color palette used as building blocks"
      preview={
        <VStack gap={2}>
          <Label>Base</Label>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            <ColorSwatch name="white" color="var(--color-white)" textLight={false} />
            <ColorSwatch name="black" color="var(--color-black)" textLight={true} />
          </div>
        </VStack>
      }
      examples={
        <VStack gap={8}>
          {/* Slate (Cool Neutral) */}
          <VStack gap={2}>
            <Label>
              Slate{' '}
              <span className="text-[var(--color-text-subtle)] font-normal">
                (Cool Neutral - Blue tint)
              </span>
            </Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorSwatch
                  key={shade}
                  name={`${shade}`}
                  color={`var(--color-slate-${shade})`}
                  textLight={shade >= 500}
                />
              ))}
            </div>
          </VStack>

          {/* Gray (Pure Neutral) */}
          <VStack gap={2}>
            <Label>
              Gray{' '}
              <span className="text-[var(--color-text-subtle)] font-normal">(Pure Neutral)</span>
            </Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorSwatch
                  key={shade}
                  name={`${shade}`}
                  color={`var(--color-gray-${shade})`}
                  textLight={shade >= 500}
                />
              ))}
            </div>
          </VStack>

          {/* Zinc (Warm Neutral) */}
          <VStack gap={2}>
            <Label>
              Zinc{' '}
              <span className="text-[var(--color-text-subtle)] font-normal">(Warm Neutral)</span>
            </Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorSwatch
                  key={shade}
                  name={`${shade}`}
                  color={`var(--color-zinc-${shade})`}
                  textLight={shade >= 500}
                />
              ))}
            </div>
          </VStack>

          {/* Neutral (True Neutral) */}
          <VStack gap={2}>
            <Label>
              Neutral{' '}
              <span className="text-[var(--color-text-subtle)] font-normal">(True Neutral)</span>
            </Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorSwatch
                  key={shade}
                  name={`${shade}`}
                  color={`var(--color-neutral-${shade})`}
                  textLight={shade >= 500}
                />
              ))}
            </div>
          </VStack>

          {/* Blue (Primary) */}
          <VStack gap={2}>
            <Label>Blue (Primary)</Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorSwatch
                  key={shade}
                  name={`${shade}`}
                  color={`var(--color-blue-${shade})`}
                  textLight={shade >= 500}
                />
              ))}
            </div>
          </VStack>

          {/* Red (Danger) */}
          <VStack gap={2}>
            <Label>Red (Danger)</Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorSwatch
                  key={shade}
                  name={`${shade}`}
                  color={`var(--color-red-${shade})`}
                  textLight={shade >= 500}
                />
              ))}
            </div>
          </VStack>

          {/* Green (Success) */}
          <VStack gap={2}>
            <Label>Green (Success)</Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorSwatch
                  key={shade}
                  name={`${shade}`}
                  color={`var(--color-green-${shade})`}
                  textLight={shade >= 500}
                />
              ))}
            </div>
          </VStack>

          {/* Orange (Warning) */}
          <VStack gap={2}>
            <Label>Orange (Warning)</Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorSwatch
                  key={shade}
                  name={`${shade}`}
                  color={`var(--color-orange-${shade})`}
                  textLight={shade >= 500}
                />
              ))}
            </div>
          </VStack>

          {/* Yellow */}
          <VStack gap={2}>
            <Label>Yellow</Label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorSwatch
                  key={shade}
                  name={`${shade}`}
                  color={`var(--color-yellow-${shade})`}
                  textLight={shade >= 500}
                />
              ))}
            </div>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Token architecture',
          path: '/design/foundation/tokens',
          description: '3-tier token structure',
        },
        {
          label: 'Semantic colors',
          path: '/design/foundation/semantic-colors',
          description: 'Purpose-driven color tokens',
        },
      ]}
    />
  );
}
