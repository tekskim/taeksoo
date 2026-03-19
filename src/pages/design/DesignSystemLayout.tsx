import { useState, useRef, useEffect, type RefObject } from 'react';
import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
  useOutletContext,
} from 'react-router-dom';
import { VStack, Disclosure } from '@/design-system';
import {
  IconSearch,
  IconX,
  IconHome,
  IconChevronRight,
  IconArrowUp,
  IconListDetails,
} from '@tabler/icons-react';
import { navGroups, allNavItems, isUpdatedToday } from './_shared/navigationData';

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
  const mainRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;
    const handleScroll = () => setShowScrollTop(mainElement.scrollTop > 300);
    mainElement.addEventListener('scroll', handleScroll);
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
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
        <nav className="fixed left-0 top-0 w-[220px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] overflow-y-auto overflow-x-hidden z-50 sidebar-scroll">
          <div className="p-4 overflow-hidden">
            {/* Logo */}
            <Link to="/design" className="flex items-center mb-4">
              <span className="text-heading-h5 text-[var(--color-text-default)]">TDS</span>
            </Link>

            {/* EntryPage Link */}
            <Link
              to="/"
              className="flex items-center gap-2 w-[188px] box-border px-3 py-2 mb-2 rounded-[var(--radius-button)] bg-[var(--color-action-secondary)] hover:bg-[var(--color-action-secondary-hover)] text-[var(--color-text-default)] text-[length:var(--font-size-11)] font-medium transition-colors border border-[var(--color-border-default)]"
            >
              <IconHome size={16} stroke={1.5} className="shrink-0" />
              <span className="truncate flex-1 min-w-0">Entry page</span>
              <IconChevronRight size={14} stroke={1.5} className="shrink-0" />
            </Link>

            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="relative">
                <IconSearch
                  size={16}
                  stroke={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search"
                  className="w-[188px] pl-9 pr-8 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[length:var(--font-size-11)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors"
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
                <div className="absolute top-full left-0 w-[188px] max-w-[188px] mt-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50 max-h-[300px] overflow-y-auto overflow-x-hidden sidebar-scroll">
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
                </div>
              )}
            </div>

            {/* All Components Link */}
            <button
              onClick={() => navigate('/design/all')}
              className={`
              w-[188px] box-border px-3 py-2 mb-3 rounded-[var(--radius-button)] flex items-center gap-2
              text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer border
              ${
                currentPath === '/design/all'
                  ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium border-transparent'
                  : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] border-[var(--color-border-default)]'
              }
            `}
            >
              <IconListDetails size={16} stroke={1.5} className="shrink-0" />
              <span className="truncate flex-1 min-w-0">All Components</span>
            </button>

            {/* Navigation Groups */}
            <VStack gap={1} className="w-[188px]">
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
                        {group.items.some((item) => isUpdatedToday(item.path)) && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-action-primary)]" />
                        )}
                        <span className="text-body-xs text-[var(--color-text-disabled)] ml-auto font-normal normal-case tracking-normal">
                          {group.items.length}
                        </span>
                      </Disclosure.Trigger>
                      <Disclosure.Panel>
                        <VStack gap={0} className="mb-1">
                          {group.items.map(({ id, label, icon: Icon, path }) => (
                            <button
                              key={id}
                              onClick={() => navigate(path)}
                              className={`
                              w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                              text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                              ${
                                currentPath === path
                                  ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                                  : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]'
                              }
                            `}
                            >
                              <Icon size={16} stroke={1.5} className="shrink-0" />
                              <span className="truncate flex-1 min-w-0">{label}</span>
                              {isUpdatedToday(path) && (
                                <span className="shrink-0 px-[5px] py-[1px] rounded-[var(--radius-sm)] text-[9px] font-bold leading-[12px] bg-[var(--color-action-primary)] text-white">
                                  N
                                </span>
                              )}
                            </button>
                          ))}
                        </VStack>
                      </Disclosure.Panel>
                    </Disclosure>
                    {group.title === 'Etc' && (
                      <div className="w-full h-px bg-[var(--color-border-subtle)] my-2" />
                    )}
                  </div>
                );
              })}
            </VStack>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main
        ref={mainRef}
        className={`absolute top-0 bottom-0 right-0 overflow-y-auto sidebar-scroll bg-[var(--color-surface-default)] ${isCaptureMode ? 'left-0' : 'left-[var(--layout-sidebar-width)]'}`}
      >
        <div className="py-12 px-8 overflow-x-auto">
          <div className="max-w-[1000px] mx-auto">
            <Outlet context={{ mainRef }} />
          </div>
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
      </main>
    </div>
  );
}
