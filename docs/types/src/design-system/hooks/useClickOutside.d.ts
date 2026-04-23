import { RefObject } from 'react';
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
export declare function useClickOutside<T extends HTMLElement = HTMLElement>(refs: RefObject<T | null>[] | RefObject<T | null>, handler: (event: MouseEvent | TouchEvent) => void, enabled?: boolean): void;
export default useClickOutside;
