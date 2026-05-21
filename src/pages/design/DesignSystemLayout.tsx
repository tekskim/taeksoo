import { useState, useRef, useEffect, type RefObject } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
  useOutletContext,
} from 'react-router-dom';
import { VStack, Disclosure, Button } from '@/design-system';
import { IconSearch, IconX, IconHome, IconArrowUp } from '@tabler/icons-react';
import { navGroups, allNavItems, isRecentlyUpdated } from './_shared/navigationData';

interface DesignLayoutContext {
  mainRef: RefObject<HTMLDivElement | null>;
}

export function useDesignLayoutContext(): RefObject<HTMLElement | null> {
  const ctx = useOutletContext<DesignLayoutContext>();
  return ctx?.mainRef ?? { current: null };
}

export function DesignSystemLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCaptureMode = searchParams.get('capture') === 'true';
  const mainOsRef = useRef<React.ComponentRef<typeof OverlayScrollbarsComponent>>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const getViewport = () => mainOsRef.current?.osInstance()?.elements().viewport;

  useEffect(() => {
    getViewport()?.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;
    const handleScroll = () => setShowScrollTop(viewport.scrollTop > 300);
    viewport.addEventListener('scroll', handleScroll);
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    getViewport()?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredNavItems = searchQuery.trim()
    ? allNavItems.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredNavItems.length > 0) {
      navigate(filteredNavItems[0].path);
      setSearchQuery('');
    }
    if (e.key === 'Escape') {
      setSearchQuery('');
    }
  };

  const currentPath = location.pathname;

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const activeGroup = navGroups.find((g) =>
      g.items.some((item) => item.path === location.pathname)
    );
    return new Set(activeGroup ? [activeGroup.title] : []);
  });

  useEffect(() => {
    const activeGroup = navGroups.find((g) => g.items.some((item) => item.path === currentPath));
    if (activeGroup && !openGroups.has(activeGroup.title)) {
      setOpenGroups((prev) => new Set([...prev, activeGroup.title]));
    }
  }, [currentPath]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Left Sidebar Navigation */}
      {!isCaptureMode && (
        <nav className="fixed left-0 top-0 w-[200px] max-w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] z-50 flex flex-col">
          {/* Search Bar — fixed at top */}
          <div className="shrink-0 p-4 pb-0">
            <div className="relative mb-4">
              <div className="relative">
                <IconSearch
                  size={16}
                  stroke={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
                <input
                  ref={searchRef}
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search"
                  className="w-full pl-9 pr-8 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[length:var(--font-size-11)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                  >
                    <IconX size={14} stroke={1.5} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchQuery.trim() && isSearchFocused && (
                <OverlayScrollbarsComponent
                  options={{
                    overflow: { x: 'hidden', y: 'scroll' },
                    scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
                  }}
                  defer={false}
                  className="absolute top-full left-0 w-full max-w-[168px] mt-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50 max-h-[300px]"
                >
                  {filteredNavItems.length > 0 ? (
                    <div className="p-2 min-w-0">
                      {filteredNavItems.map(({ id, label, icon: Icon, path }) => (
                        <button
                          key={id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(path);
                            setSearchQuery('');
                            setIsSearchFocused(false);
                          }}
                          className="w-full min-w-0 px-3 py-2 rounded-[var(--radius-md)] flex items-center gap-2 text-left hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
                        >
                          <Icon
                            size={14}
                            stroke={1.5}
                            className="text-[var(--color-text-muted)] shrink-0"
                          />
                          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)] truncate min-w-0">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="p-3 text-left text-[length:var(--font-size-11)] text-[var(--color-text-muted)] w-full max-w-full min-w-0 break-words"
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    >
                      No results found
                    </div>
                  )}
                </OverlayScrollbarsComponent>
              )}
            </div>
          </div>

          <OverlayScrollbarsComponent
            options={{
              overflow: { x: 'hidden', y: 'scroll' },
              scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
            }}
            defer={false}
            className="flex-1 min-h-0"
          >
            <div className="max-w-[200px] box-border px-4 pb-4 overflow-hidden">
              {/* Navigation Groups */}
              <VStack gap={1} className="w-[168px]">
                {navGroups.map((group) => {
                  const isOpen = openGroups.has(group.title);
                  return (
                    <div key={group.title}>
                      <Disclosure
                        open={isOpen}
                        onChange={(open) => {
                          setOpenGroups((prev) => {
                            const next = new Set(prev);
                            if (open) next.add(group.title);
                            else next.delete(group.title);
                            return next;
                          });
                        }}
                      >
                        <Disclosure.Trigger className="w-full py-1.5 items-center gap-1.5 text-label-sm font-semibold !text-[var(--color-text-default)] tracking-wide hover:!text-[var(--color-text-muted)]">
                          {group.title}
                          <span className="text-body-xs text-[var(--color-text-disabled)] font-normal normal-case tracking-normal">
                            {group.items.length}
                          </span>
                          {group.items.some((item) => isRecentlyUpdated(item.path)) && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-action-primary)] ml-auto" />
                          )}
                        </Disclosure.Trigger>
                        <Disclosure.Panel>
                          <VStack gap={0} className="mb-1">
                            {group.items.map(({ id, label, icon: Icon, path }) => (
                              <button
                                key={id}
                                onClick={() => navigate(path)}
                                className={`
                              w-full px-3 py-2 flex items-center gap-2
                              text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                              ${
                                currentPath === path
                                  ? 'bg-[var(--menu-item-active-bg)] text-[var(--menu-item-active-text)] font-medium'
                                  : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]'
                              }
                            `}
                              >
                                <Icon size={16} stroke={1.5} className="shrink-0" />
                                <span className="truncate flex-1 min-w-0">{label}</span>
                                {isRecentlyUpdated(path) && (
                                  <span className="shrink-0 px-[5px] py-[1px] rounded-[var(--radius-sm)] text-[9px] font-bold leading-[12px] bg-[var(--color-action-primary)] text-white">
                                    N
                                  </span>
                                )}
                              </button>
                            ))}
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>
                    </div>
                  );
                })}
              </VStack>
            </div>
          </OverlayScrollbarsComponent>

          {/* Entry Page Button — fixed at bottom */}
          <div className="shrink-0 px-4 py-4 border-t border-[var(--color-border-subtle)]">
            <Link to="/">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconHome size={12} />}
                className="w-full"
              >
                Entry page
              </Button>
            </Link>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <OverlayScrollbarsComponent
        element="main"
        ref={mainOsRef}
        options={{
          overflow: { x: 'hidden', y: 'scroll' },
          scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
        }}
        defer={false}
        className={`absolute top-0 bottom-0 right-0 bg-[var(--color-surface-default)] ${isCaptureMode ? 'left-0' : 'left-[var(--layout-sidebar-width)]'}`}
      >
        <div className="py-12 px-12 overflow-x-auto">
          <Outlet context={{ mainRef: { current: getViewport() ?? null } }} />
        </div>

        {/* Scroll to Top Button */}
        {!isCaptureMode && showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-[var(--color-action-primary)] text-[var(--semantic-color-on-primary)] flex items-center justify-center shadow-lg hover:bg-[var(--color-action-primary-hover)] transition-colors"
          >
            <IconArrowUp size={20} stroke={2} />
          </button>
        )}
      </OverlayScrollbarsComponent>
    </div>
  );
}
