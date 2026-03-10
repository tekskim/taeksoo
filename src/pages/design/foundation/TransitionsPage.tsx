import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';

function DurationDemo({ duration, label }: { duration: string; label: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setActive(!active)}
        className="px-2 py-1 text-body-xs font-medium bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
      >
        {active ? 'Reset' : 'Play'}
      </button>
      <div className="flex-1 h-8 bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-md)] overflow-hidden relative">
        <div
          className="absolute top-0 left-0 h-full rounded-[var(--primitive-radius-md)]"
          style={{
            width: active ? '100%' : '0%',
            backgroundColor: 'var(--color-action-primary)',
            opacity: 0.7,
            transition: `width ${duration} ease-out`,
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-body-xs font-mono text-[var(--color-text-muted)]">
          {duration}
        </span>
      </div>
    </div>
  );
}

function EasingDemo({ easing }: { easing: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setActive(!active)}
        className="px-2 py-1 text-body-xs font-medium bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer shrink-0"
      >
        {active ? 'Reset' : 'Play'}
      </button>
      <div className="flex-1 h-8 bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-md)] relative overflow-hidden px-1">
        <div
          className="absolute top-1 w-6 h-6 rounded-full bg-[var(--color-action-primary)]"
          style={{
            left: active ? 'calc(100% - 28px)' : '4px',
            transition: `left 600ms ${easing}`,
          }}
        />
      </div>
    </div>
  );
}

const durationTokens = [
  {
    name: 'fast',
    value: '150ms',
    token: '--duration-fast',
    primitive: '--primitive-duration-fast',
    usage: 'Hover, focus, color changes',
  },
  {
    name: 'normal',
    value: '200ms',
    token: '--duration-normal',
    primitive: '--primitive-duration-normal',
    usage: 'Default transitions, dropdowns, tooltips',
  },
  {
    name: 'slow',
    value: '300ms',
    token: '--duration-slow',
    primitive: '--primitive-duration-slow',
    usage: 'Modals, drawers, page transitions',
  },
];

const easingFunctions = [
  {
    name: 'ease',
    css: 'ease',
    desc: 'Default browser easing — gentle acceleration and deceleration',
    usage: 'General-purpose, theme transitions',
  },
  {
    name: 'ease-out',
    css: 'ease-out',
    desc: 'Fast start, slow end — feels responsive and natural',
    usage: 'Modals, panels, popups entering',
  },
  {
    name: 'ease-in-out',
    css: 'ease-in-out',
    desc: 'Smooth acceleration and deceleration — balanced motion',
    usage: 'Loading shimmer, continuous animations',
  },
  {
    name: 'linear',
    css: 'linear',
    desc: 'Constant speed — no acceleration',
    usage: 'Progress bars, timers',
  },
];

const cssPatterns = [
  {
    pattern: 'Color change',
    properties: 'background-color, border-color, color',
    duration: '150ms',
    easing: 'ease',
    components: 'Button, Input, Toggle, Menu item',
  },
  {
    pattern: 'Opacity',
    properties: 'opacity',
    duration: '200ms',
    easing: 'ease-out',
    components: 'Tooltip, Backdrop, Fade transitions',
  },
  {
    pattern: 'Transform',
    properties: 'transform (scale, translate)',
    duration: '200ms',
    easing: 'ease-out',
    components: 'Modal, Popover, Desktop icons',
  },
  {
    pattern: 'Layout shift',
    properties: 'width, height, padding',
    duration: '200ms',
    easing: 'ease',
    components: 'Sidebar, Disclosure, Drawer',
  },
  {
    pattern: 'All properties',
    properties: 'all',
    duration: '150ms',
    easing: 'ease',
    components: 'Generic hover states',
  },
  {
    pattern: 'Theme switch',
    properties: 'background-color, border-color, color, fill, stroke',
    duration: '300ms / 150ms',
    easing: 'ease',
    components: 'Global (root-level)',
  },
];

const MOCK_APPS = [
  { id: 'compute', name: 'Compute', color: '#3b82f6' },
  { id: 'storage', name: 'Storage', color: '#8b5cf6' },
  { id: 'container', name: 'Container', color: '#06b6d4' },
  { id: 'iam', name: 'IAM', color: '#f59e0b' },
];

function DesktopAppDemo() {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const toggleWindow = useCallback(
    (appId: string) => {
      setOpenWindows((prev) => {
        if (prev.includes(appId)) {
          if (activeWindow === appId) setActiveWindow(prev.filter((id) => id !== appId)[0] ?? null);
          return prev.filter((id) => id !== appId);
        }
        setActiveWindow(appId);
        return [...prev, appId];
      });
    },
    [activeWindow]
  );

  const closeAll = useCallback(() => {
    setOpenWindows([]);
    setActiveWindow(null);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          Click dock icons to open/close windows — observe the scale + opacity animation
        </p>
        {openWindows.length > 0 && (
          <button
            type="button"
            onClick={closeAll}
            className="px-2 py-1 text-body-xs font-medium bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            Close All
          </button>
        )}
      </div>

      {/* Mini Desktop Area */}
      <div className="relative w-full h-[280px] bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[var(--primitive-radius-lg)] overflow-hidden border border-[var(--color-border-default)]">
        {/* Desktop top bar */}
        <div className="h-6 bg-black/30 flex items-center px-3">
          <span className="text-[9px] font-medium text-white/60">Desktop Preview</span>
        </div>

        {/* Window area */}
        <div className="relative flex-1 h-[220px]">
          <AnimatePresence>
            {MOCK_APPS.filter((app) => openWindows.includes(app.id)).map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute rounded-md overflow-hidden shadow-xl"
                style={{
                  width: 220,
                  height: 140,
                  left: 30 + i * 40,
                  top: 10 + i * 20,
                  zIndex: activeWindow === app.id ? 10 : i,
                  border:
                    activeWindow === app.id
                      ? '2px solid var(--color-action-primary)'
                      : '1px solid rgba(255,255,255,0.1)',
                }}
                onClick={() => setActiveWindow(app.id)}
              >
                <div
                  className="h-5 flex items-center justify-between px-2"
                  style={{ backgroundColor: app.color + '20' }}
                >
                  <span className="text-[8px] font-medium text-white/80">{app.name}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
                    <button
                      type="button"
                      className="w-1.5 h-1.5 rounded-full bg-red-400/70 cursor-pointer hover:bg-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWindow(app.id);
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 bg-[#1e293b] p-2">
                  <div className="flex gap-1.5 mb-2">
                    <div
                      className="w-10 h-1.5 rounded-full"
                      style={{ backgroundColor: app.color + '40' }}
                    />
                    <div
                      className="w-6 h-1.5 rounded-full"
                      style={{ backgroundColor: app.color + '25' }}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-1 rounded-full bg-white/5" />
                    <div className="w-4/5 h-1 rounded-full bg-white/5" />
                    <div className="w-3/5 h-1 rounded-full bg-white/5" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1">
                    {[...Array(6)].map((_, j) => (
                      <div
                        key={j}
                        className="h-4 rounded-sm"
                        style={{ backgroundColor: app.color + '15' }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {openWindows.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] text-white/30">Click an app icon below to open</span>
            </div>
          )}
        </div>

        {/* Dock */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
          {MOCK_APPS.map((app) => {
            const isOpen = openWindows.includes(app.id);
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => toggleWindow(app.id)}
                className="relative flex flex-col items-center gap-0.5 cursor-pointer group"
              >
                <motion.div
                  whileDrag={{
                    scale: 1.1,
                    zIndex: 50,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: app.color }}
                >
                  {app.name[0]}
                </motion.div>
                {isOpen && <div className="w-1 h-1 rounded-full bg-white/60" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation spec */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
          <span className="text-label-sm text-[var(--color-text-muted)]">Window Open</span>
          <pre className="text-body-xs font-mono text-[var(--color-text-default)] mt-1">{`scale: 0.95 → 1
opacity: 0 → 1
duration: 200ms
ease: easeOut`}</pre>
        </div>
        <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
          <span className="text-label-sm text-[var(--color-text-muted)]">Window Close</span>
          <pre className="text-body-xs font-mono text-[var(--color-text-default)] mt-1">{`scale: 1 → 0.95
opacity: 1 → 0
duration: 200ms
ease: easeOut`}</pre>
        </div>
        <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
          <span className="text-label-sm text-[var(--color-text-muted)]">Dock Icon Drag</span>
          <pre className="text-body-xs font-mono text-[var(--color-text-default)] mt-1">{`scale: 1.1, zIndex: 50
boxShadow: 0 10px 30px
type: spring
stiffness: 400, damping: 25`}</pre>
        </div>
      </div>
    </div>
  );
}

const framerMotionPatterns = [
  {
    name: 'Window Open / Close',
    code: `initial={{ scale: 0.95, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.95, opacity: 0 }}
transition={{ duration: 0.2, ease: 'easeOut' }}`,
    usage: 'PageWindow — app window enter/exit',
  },
  {
    name: 'Admin Center Panel',
    code: `initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.9, opacity: 0 }}
transition={{ duration: 0.2, ease: 'easeOut' }}`,
    usage: 'AdminCenterPanel — scale 0.9 (larger pop)',
  },
  {
    name: 'Backdrop Fade',
    code: `initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2, ease: 'easeOut' }}`,
    usage: 'AdminCenterPanel overlay (bg-black/40)',
  },
  {
    name: 'Dock Icon Drag',
    code: `whileDrag={{
  scale: 1.1, zIndex: 50,
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
}}
transition={{ type: 'spring', stiffness: 400, damping: 25 }}`,
    usage: 'DockIconItem — icon lift on drag',
  },
  {
    name: 'Dock Reorder',
    code: `whileDrag={{ scale: 1.15, zIndex: 50, cursor: 'grabbing' }}
transition={{ type: 'spring', stiffness: 400, damping: 25 }}
layout dragElastic={0.1}`,
    usage: 'Reorder.Item — drag reorder with layout',
  },
  {
    name: 'Layout ID + AnimatePresence',
    code: `<motion.div layoutId={app.id}>
  {/* shared layout identity */}
</motion.div>

<AnimatePresence>
  {isOpen && <motion.div ... />}
</AnimatePresence>`,
    usage: 'DockIconItem layoutId, window conditional render',
  },
];

export function TransitionsPage() {
  return (
    <ComponentPageTemplate
      title="Transitions"
      description="Duration tokens, easing functions, and animation patterns for consistent motion across the system"
      preview={
        <div className="space-y-10">
          {/* Duration Tokens */}
          <div className="space-y-4">
            <h3 className="text-heading-h6 text-[var(--color-text-default)]">Duration Tokens</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {durationTokens.map(({ name, value, token, primitive, usage }) => (
                <div
                  key={name}
                  className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-heading-h6 text-[var(--color-text-default)] capitalize">
                      {name}
                    </span>
                    <span className="text-body-md font-mono text-[var(--color-text-muted)]">
                      {value}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <code className="text-body-sm font-mono text-[var(--color-state-info)]">
                      {token}
                    </code>
                    <code className="text-body-xs font-mono text-[var(--color-text-subtle)]">
                      {primitive}
                    </code>
                  </div>
                  <p className="text-body-sm text-[var(--color-text-subtle)]">{usage}</p>
                  <DurationDemo duration={value} label={name} />
                </div>
              ))}
            </div>
          </div>

          {/* Easing Functions */}
          <div className="space-y-4">
            <h3 className="text-heading-h6 text-[var(--color-text-default)]">Easing Functions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {easingFunctions.map(({ name, css, desc, usage }) => (
                <div
                  key={name}
                  className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-heading-h6 text-[var(--color-text-default)]">{name}</span>
                    <code className="text-body-sm font-mono text-[var(--color-text-muted)]">
                      {css}
                    </code>
                  </div>
                  <p className="text-body-sm text-[var(--color-text-subtle)]">{desc}</p>
                  <p className="text-body-xs text-[var(--color-text-muted)]">
                    <strong>Usage:</strong> {usage}
                  </p>
                  <EasingDemo easing={css} />
                </div>
              ))}
            </div>
          </div>

          {/* CSS Transition Patterns */}
          <div className="space-y-4">
            <h3 className="text-heading-h6 text-[var(--color-text-default)]">
              CSS Transition Patterns
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                      Pattern
                    </th>
                    <th className="py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                      Properties
                    </th>
                    <th className="py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                      Duration
                    </th>
                    <th className="py-2 pr-4 text-label-sm text-[var(--color-text-muted)]">
                      Easing
                    </th>
                    <th className="py-2 text-label-sm text-[var(--color-text-muted)]">
                      Components
                    </th>
                  </tr>
                </thead>
                <tbody className="text-body-md">
                  {cssPatterns.map(({ pattern, properties, duration, easing, components }) => (
                    <tr key={pattern} className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2.5 pr-4 text-[var(--color-text-default)] font-medium whitespace-nowrap">
                        {pattern}
                      </td>
                      <td className="py-2.5 pr-4 font-mono text-body-sm text-[var(--color-text-muted)]">
                        {properties}
                      </td>
                      <td className="py-2.5 pr-4 font-mono text-body-sm text-[var(--color-state-info)]">
                        {duration}
                      </td>
                      <td className="py-2.5 pr-4 font-mono text-body-sm text-[var(--color-text-muted)]">
                        {easing}
                      </td>
                      <td className="py-2.5 text-body-sm text-[var(--color-text-subtle)]">
                        {components}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Framer Motion Patterns */}
          <div className="space-y-4">
            <h3 className="text-heading-h6 text-[var(--color-text-default)]">
              Framer Motion Patterns (Desktop)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {framerMotionPatterns.map(({ name, code, usage }) => (
                <div
                  key={name}
                  className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex flex-col gap-3"
                >
                  <span className="text-heading-h6 text-[var(--color-text-default)]">{name}</span>
                  <pre className="text-body-sm font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-default)] p-3 rounded-[var(--primitive-radius-md)] overflow-x-auto whitespace-pre">
                    {code}
                  </pre>
                  <p className="text-body-sm text-[var(--color-text-subtle)]">
                    <strong>Usage:</strong> {usage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop App Animation Demo */}
          <div className="space-y-4">
            <h3 className="text-heading-h6 text-[var(--color-text-default)]">
              Desktop App Animation
            </h3>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Interactive demo of the desktop window open/close animation. Uses{' '}
              <code className="font-mono text-body-sm">framer-motion</code> with{' '}
              <code className="font-mono text-body-sm">AnimatePresence</code> for enter/exit
              transitions.
            </p>
            <DesktopAppDemo />
          </div>

          {/* Motion Principles */}
          <div className="space-y-4">
            <h3 className="text-heading-h6 text-[var(--color-text-default)]">Motion Principles</h3>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              TDS의 모션은 다음 4가지 원칙을 따릅니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  title: 'Purposeful',
                  desc: '모든 애니메이션은 사용자에게 공간적 맥락(어디서 왔는지, 어디로 가는지)을 제공하거나 상태 변화를 알리는 목적이 있어야 합니다.',
                },
                {
                  title: 'Quick',
                  desc: '인터랙티브 UI 트랜지션은 300ms 이내로 유지합니다. 150ms(fast)는 미세한 피드백, 200ms(normal)는 표준 전환, 300ms(slow)는 큰 영역 변화에 사용합니다.',
                },
                {
                  title: 'Natural',
                  desc: '진입은 ease-out(빠르게 나타나 부드럽게 정착), 퇴장은 ease-in(가속하며 사라짐), 양방향은 ease-in-out을 사용하여 물리적으로 자연스러운 움직임을 만듭니다.',
                },
                {
                  title: 'Accessible',
                  desc: 'prefers-reduced-motion 미디어 쿼리를 존중합니다. 모션이 줄어든 환경에서는 opacity만 사용하거나 즉시 전환으로 대체합니다.',
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]"
                >
                  <span className="text-heading-h7 text-[var(--color-text-default)]">
                    {p.title}
                  </span>
                  <p className="text-body-sm text-[var(--color-text-subtle)] mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reduced Motion Support */}
          <div className="space-y-3">
            <h3 className="text-heading-h6 text-[var(--color-text-default)]">
              Reduced Motion Support
            </h3>
            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] font-mono text-body-sm text-[var(--color-text-default)]">
              <pre>{`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`}</pre>
            </div>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              OS 설정에서 모션 줄이기를 활성화한 사용자를 위해, 모든 CSS 트랜지션과 애니메이션을
              거의 즉시로 전환합니다. Framer Motion 사용 시에도 이 미디어 쿼리를 감지하여 duration을
              0으로 설정하는 것을 권장합니다.
            </p>
          </div>

          {/* Guidelines */}
          <div className="space-y-4">
            <h3 className="text-heading-h6 text-[var(--color-text-default)]">Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-state-success-bg)] border border-[var(--color-state-success)]/20 rounded-[var(--primitive-radius-lg)]">
                <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-2">DO</h4>
                <ul className="text-body-md text-[var(--color-text-default)] space-y-1.5">
                  <li>• Use duration tokens instead of hardcoded values</li>
                  <li>
                    • Prefer <code className="font-mono text-body-sm">ease-out</code> for elements
                    entering the viewport
                  </li>
                  <li>• Keep durations under 300ms for UI interactions</li>
                  <li>
                    • Use <code className="font-mono text-body-sm">AnimatePresence</code> for
                    enter/exit animations
                  </li>
                  <li>• Match transition speed to the size of the change</li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-state-danger-bg)] border border-[var(--color-state-danger)]/20 rounded-[var(--primitive-radius-lg)]">
                <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-2">DON'T</h4>
                <ul className="text-body-md text-[var(--color-text-default)] space-y-1.5">
                  <li>• Don't animate layout properties (width/height) unless necessary</li>
                  <li>• Don't use durations longer than 500ms for interactive UI</li>
                  <li>
                    • Don't use <code className="font-mono text-body-sm">ease-in</code> alone — it
                    feels sluggish on entry
                  </li>
                  <li>• Don't animate multiple unrelated properties simultaneously</li>
                  <li>
                    • Don't forget{' '}
                    <code className="font-mono text-body-sm">prefers-reduced-motion</code>{' '}
                    accessibility
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      }
      relatedLinks={[
        {
          label: 'Shadows',
          path: '/design/foundation/shadows',
          description: 'Box shadow tokens',
        },
        {
          label: 'Token architecture',
          path: '/design/foundation/tokens',
          description: '3-tier token structure',
        },
      ]}
    />
  );
}
