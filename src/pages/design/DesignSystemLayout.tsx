import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { VStack } from '@/design-system';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { IconSearch, IconX, IconHome, IconChevronRight, IconArrowUp } from '@tabler/icons-react';
import { navGroups, allNavItems } from './_shared/navigationData';

export function DesignSystemLayout() {
  const location = useLocation();
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Left Sidebar Navigation */}
      <nav className="fixed left-0 top-0 w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] overflow-y-auto overflow-x-hidden z-50 sidebar-scroll">
        <div className="p-4 overflow-hidden">
          {/* Logo */}
          <Link to="/design" className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">TDS</span>
            </div>
            <span className="text-[length:var(--font-size-14)] font-semibold text-[var(--color-text-default)]">
              Design system
            </span>
          </Link>

          {/* EntryPage Link */}
          <Link
            to="/"
            className="flex items-center gap-2 w-[166px] box-border px-3 py-2 mb-2 rounded-[var(--radius-button)] bg-[var(--color-action-secondary)] hover:bg-[var(--color-action-secondary-hover)] text-[var(--color-text-default)] text-[length:var(--font-size-11)] font-medium transition-colors border border-[var(--color-border-default)]"
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
                className="w-[166px] pl-9 pr-8 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[length:var(--font-size-11)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors"
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
              <div className="absolute top-full left-0 w-[166px] max-w-[166px] mt-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50 max-h-[300px] overflow-y-auto overflow-x-hidden sidebar-scroll">
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

          {/* Navigation Groups */}
          <VStack gap={4}>
            {navGroups.map((group) => (
              <VStack key={group.title} gap={1} className="w-[166px]">
                <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                  {group.title}
                </span>
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
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                      }
                    `}
                  >
                    <Icon size={16} stroke={1.5} />
                    {label}
                  </button>
                ))}
              </VStack>
            ))}
          </VStack>
        </div>
      </nav>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="absolute top-0 bottom-0 right-0 left-[var(--layout-sidebar-width)] overflow-y-auto sidebar-scroll"
      >
        <div className="py-12 px-8 overflow-x-auto">
          <div className="min-w-[var(--layout-content-min-width)]">
            <div className="max-w-[1000px] mx-auto">
              <VStack gap={12} align="stretch">
                {/* Header */}
                <div className="flex items-center justify-between w-full">
                  <VStack gap={2} align="start">
                    <h1 className="text-[length:var(--font-size-40)] font-semibold text-[var(--color-text-default)]">
                      TDS Design system
                    </h1>
                    <p className="text-[length:var(--font-size-16)] text-[var(--color-text-muted)]">
                      Design tokens and components built with a 3-tier token architecture
                    </p>
                  </VStack>
                  <div className="flex items-center gap-3">
                    <DarkModeToggle size="sm" scrollContainerRef={mainRef} />
                    <Link to="/">
                      <button className="px-4 py-2 border border-[var(--color-border-default)] rounded-[var(--radius-button)] text-[length:var(--font-size-12)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)] transition-colors">
                        Entry page →
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Page Content */}
                <Outlet context={{ mainRef }} />
              </VStack>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-[var(--color-action-primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-action-primary-hover)] transition-colors"
          >
            <IconArrowUp size={20} stroke={2} />
          </button>
        )}
      </main>
    </div>
  );
}
