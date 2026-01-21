import { useEffect, useRef, type RefObject } from 'react';

/**
 * Hook to detect clicks outside of specified elements
 * 
 * @example
 * ```tsx
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *   const contentRef = useRef<HTMLDivElement>(null);
 *   
 *   useClickOutside([triggerRef, contentRef], () => setIsOpen(false), isOpen);
 *   
 *   return (
 *     <>
 *       <button ref={triggerRef}>Toggle</button>
 *       {isOpen && <div ref={contentRef}>Content</div>}
 *     </>
 *   );
 * }
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  refs: RefObject<T | null>[] | RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const refsArray = Array.isArray(refs) ? refs : [refs];

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Check if click is inside any of the refs
      const isInside = refsArray.some((ref) => {
        return ref.current?.contains(target);
      });

      if (!isInside) {
        savedHandler.current(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, enabled]);
}

export default useClickOutside;
