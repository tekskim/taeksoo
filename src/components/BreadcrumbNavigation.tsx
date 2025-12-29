import { HStack, Breadcrumb } from '@/design-system';
import { IconChevronLeft, IconChevronRight, IconBell, IconSun, IconMoon } from '@tabler/icons-react';
import { useDarkMode } from '@/hooks/useDarkMode';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  onForward?: () => void;
  hasNotification?: boolean;
  onNotificationClick?: () => void;
}

/* ----------------------------------------
   BreadcrumbNavigation Component
   ---------------------------------------- */

export function BreadcrumbNavigation({
  items,
  onBack,
  onForward,
  hasNotification = false,
  onNotificationClick,
}: BreadcrumbNavigationProps) {
  const { isDark, toggleDarkMode } = useDarkMode();
  
  // Convert items to Breadcrumb format
  const breadcrumbItems = items.map((item, index) => ({
    label: item.label,
    href: index === items.length - 1 ? undefined : item.href, // Last item has no link
  }));

  return (
    <div className="h-8 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)] px-3 flex items-center justify-between">
      {/* Left: Navigation + Breadcrumbs */}
      <HStack gap={2} align="center">
        {/* Navigation Buttons */}
        <div className="flex items-center border border-[var(--color-border-strong)] rounded-[var(--radius-md)] p-1 gap-1">
          <button
            onClick={onBack}
            className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors duration-[var(--duration-fast)]"
            aria-label="Go back"
          >
            <IconChevronLeft size={16} className="text-[var(--color-text-default)]" strokeWidth={1.5} />
          </button>
          <div className="w-px h-2 bg-[var(--color-border-default)]" />
          <button
            onClick={onForward}
            className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors duration-[var(--duration-fast)]"
            aria-label="Go forward"
          >
            <IconChevronRight size={16} className="text-[var(--color-text-default)]" strokeWidth={1.5} />
          </button>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />
      </HStack>

      {/* Right: Dark Mode Toggle + Notification */}
      <HStack gap={1} align="center">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-1 hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)]"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <IconSun size={16} className="text-[var(--color-text-default)]" strokeWidth={1.5} />
          ) : (
            <IconMoon size={16} className="text-[var(--color-text-default)]" strokeWidth={1.5} />
          )}
        </button>

        {/* Notification */}
        <button
          onClick={onNotificationClick}
          className="p-1 hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)] relative"
          aria-label="Notifications"
        >
          <IconBell size={16} className="text-[var(--color-text-default)]" strokeWidth={1.5} />
          {hasNotification && (
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[var(--color-red-500)] rounded-full" />
          )}
        </button>
      </HStack>
    </div>
  );
}

export default BreadcrumbNavigation;
