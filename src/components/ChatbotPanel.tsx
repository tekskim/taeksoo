import { useState, useEffect } from 'react';
import { IconChevronsRight } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ----------------------------------------
   ChatbotPanel Component
   ---------------------------------------- */

export function ChatbotPanel({ isOpen, onClose }: ChatbotPanelProps) {
  // Animation states (following Drawer pattern)
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle mount/unmount with animation (following Drawer pattern)
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`
        fixed top-[52px] right-0 bottom-0 w-[400px]
        bg-[var(--color-surface-default)] 
        shadow-lg border-l border-[var(--color-border-subtle)] 
        overflow-hidden z-[3000] flex flex-col
        transition-all duration-300 ease-out
        ${isAnimating 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-full'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border-default)] shrink-0 bg-[var(--color-surface-default)]">
        <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)]">
          AI Chatbot
        </span>
        <button 
          className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] rounded transition-colors cursor-pointer"
          onClick={onClose}
          title="Collapse"
        >
          <IconChevronsRight size={18} stroke={1.5} />
        </button>
      </div>

      {/* Iframe Content */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src="https://tkai.thakicloud.site:10100/"
          className="w-full h-full border-none"
          title="AI Chatbot"
          allow="microphone; camera"
        />
      </div>
    </div>
  );
}

export default ChatbotPanel;


