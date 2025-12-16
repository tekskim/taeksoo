import { Sidebar } from '@/components/Sidebar';
import { VStack } from '@/design-system';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

/* ----------------------------------------
   HUMAIN-inspired Gradient Colors
   Reference: https://www.humain.com/
   ---------------------------------------- */

const GRADIENTS = [
  {
    name: 'HUMAIN Brand',
    css: 'linear-gradient(180deg in oklab, #00D4AA 0%, #6366F1 55%, #EC4899 100%)',
    cssVariable: 'linear-gradient(180deg in oklab, var(--color-tertiary) 0%, var(--color-primary) 55%, var(--color-secondary) 100%)',
    colors: ['#00D4AA', '#6366F1', '#EC4899'],
    description: 'Official HUMAIN brand gradient (oklab color space)',
  },
  {
    name: 'HUMAIN Primary',
    css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    colors: ['#667eea', '#764ba2'],
    description: 'Purple to Violet - Main brand gradient',
  },
  {
    name: 'HUMAIN Vibrant',
    css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    colors: ['#f093fb', '#f5576c'],
    description: 'Pink to Coral - Energetic accent',
  },
  {
    name: 'HUMAIN Ocean',
    css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    colors: ['#4facfe', '#00f2fe'],
    description: 'Blue to Cyan - Tech & Innovation',
  },
  {
    name: 'HUMAIN Sunset',
    css: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    colors: ['#fa709a', '#fee140'],
    description: 'Pink to Yellow - Warm & Creative',
  },
  {
    name: 'HUMAIN Aurora',
    css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    colors: ['#a8edea', '#fed6e3'],
    description: 'Teal to Pink - Soft & Elegant',
  },
  {
    name: 'HUMAIN Deep',
    css: 'linear-gradient(135deg, #5f2c82 0%, #49a09d 100%)',
    colors: ['#5f2c82', '#49a09d'],
    description: 'Purple to Teal - Deep & Mysterious',
  },
  {
    name: 'HUMAIN Electric',
    css: 'linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)',
    colors: ['#7f00ff', '#e100ff'],
    description: 'Violet to Magenta - Bold & Electric',
  },
  {
    name: 'HUMAIN Cosmic',
    css: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    colors: ['#0f0c29', '#302b63', '#24243e'],
    description: 'Dark Space - Cosmic & Premium',
  },
  {
    name: 'HUMAIN Neon',
    css: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    colors: ['#00c6ff', '#0072ff'],
    description: 'Cyan to Blue - Digital & Modern',
  },
  {
    name: 'HUMAIN Fire',
    css: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    colors: ['#f12711', '#f5af19'],
    description: 'Red to Orange - Powerful & Dynamic',
  },
  {
    name: 'HUMAIN Forest',
    css: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    colors: ['#134e5e', '#71b280'],
    description: 'Dark Teal to Green - Natural & Calm',
  },
  {
    name: 'HUMAIN Royal',
    css: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    colors: ['#141e30', '#243b55'],
    description: 'Navy to Slate - Professional & Refined',
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <IconCheck size={14} className="text-green-400" /> : <IconCopy size={14} className="text-white/80" />}
    </button>
  );
}

interface GradientItem {
  name: string;
  css: string;
  cssVariable?: string;
  colors: string[];
  description: string;
}

function GradientCard({ gradient }: { gradient: GradientItem }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      {/* Gradient Preview */}
      <div 
        className="h-40 flex items-end p-4"
        style={{ background: gradient.css }}
      >
        <div className="flex gap-2">
          <CopyButton text={gradient.cssVariable || gradient.css} />
        </div>
      </div>
      
      {/* Info */}
      <div className="bg-white p-4 space-y-2">
        <h3 className="font-semibold text-slate-900">{gradient.name}</h3>
        <p className="text-sm text-slate-500">{gradient.description}</p>
        
        {/* Color Swatches */}
        <div className="flex flex-wrap gap-2 pt-2">
          {gradient.colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div 
                className="w-6 h-6 rounded-full border border-slate-200 shadow-sm"
                style={{ backgroundColor: color }}
              />
              <code className="text-xs text-slate-600 font-mono">{color}</code>
            </div>
          ))}
        </div>
        
        {/* CSS Variable Code (if exists) */}
        {gradient.cssVariable && (
          <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-purple-700">CSS Variable</span>
              <CopyButton text={gradient.cssVariable} />
            </div>
            <code className="text-xs text-purple-800 break-all">{gradient.cssVariable}</code>
          </div>
        )}
        
        {/* CSS Code */}
        <div className="mt-3 p-2 bg-slate-100 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">CSS</span>
          </div>
          <code className="text-xs text-slate-700 break-all">{gradient.css}</code>
        </div>
      </div>
    </div>
  );
}

export function GradientShowcasePage() {
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);

  return (
    <div className="flex h-screen bg-[var(--color-surface-default)]">
      <Sidebar />
      
      <div className="flex flex-col items-stretch justify-start gap-4 flex-1 overflow-hidden ml-[200px]">
        
        <div className="flex-1 overflow-auto p-6 space-y-8">
          {/* Hero Section with Selected Gradient */}
          <div 
            className="relative rounded-3xl overflow-hidden h-64 flex items-center justify-center transition-all duration-500"
            style={{ background: selectedGradient.css }}
          >
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">HUMAIN Gradients</h1>
              <p className="text-lg opacity-90 drop-shadow">Inspired by humain.com</p>
              <p className="text-sm mt-4 opacity-75">{selectedGradient.name}</p>
            </div>
            
            {/* Floating Decorations */}
            <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-white/10 blur-xl" />
            <div className="absolute bottom-8 right-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          </div>
          
          {/* Gradient Selector */}
          <div className="flex gap-2 flex-wrap">
            {GRADIENTS.map((gradient, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGradient(gradient)}
                className={`w-12 h-12 rounded-xl transition-all duration-200 ${
                  selectedGradient.name === gradient.name 
                    ? 'ring-2 ring-offset-2 ring-purple-500 scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{ background: gradient.css }}
                title={gradient.name}
              />
            ))}
          </div>
          
          {/* Grid of Gradient Cards */}
          <VStack gap={6}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Gradient Collection</h2>
              <span className="text-sm text-slate-500">{GRADIENTS.length} gradients</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {GRADIENTS.map((gradient, idx) => (
                <GradientCard key={idx} gradient={gradient} />
              ))}
            </div>
          </VStack>
          
          {/* Usage Examples */}
          <VStack gap={6}>
            <h2 className="text-2xl font-bold text-slate-900">Usage Examples</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Button Examples */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  {GRADIENTS.slice(0, 4).map((g, idx) => (
                    <button
                      key={idx}
                      className="px-4 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
                      style={{ background: g.css }}
                    >
                      {g.name.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Badge Examples */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {GRADIENTS.slice(0, 6).map((g, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{ background: g.css }}
                    >
                      {g.name.split(' ')[1]}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Text Examples */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700">Text</h3>
                <div className="space-y-2">
                  {GRADIENTS.slice(0, 3).map((g, idx) => (
                    <p
                      key={idx}
                      className="text-2xl font-bold bg-clip-text text-transparent"
                      style={{ backgroundImage: g.css }}
                    >
                      {g.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </VStack>
          
          {/* CSS Code Block */}
          <VStack gap={4}>
            <h2 className="text-2xl font-bold text-slate-900">CSS Variables</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="text-sm text-slate-300">
{`:root {
${GRADIENTS.map((g, idx) => `  --gradient-${idx + 1}: ${g.css};`).join('\n')}
}

/* Usage */
.gradient-bg {
  background: var(--gradient-1);
}

.gradient-text {
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`}
              </pre>
            </div>
          </VStack>
        </div>
      </div>
    </div>
  );
}
