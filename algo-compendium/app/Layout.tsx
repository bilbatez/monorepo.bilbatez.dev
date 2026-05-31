import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { CategoryIcon } from '../_components/CategoryIcon';
import type { AlgorithmCategory } from '../_algorithms/_shared/types';
import { useI18n, useTheme, type Language } from './_i18n';

const SIDEBAR_KEY = 'algo-sidebar-collapsed';

type NavCategory = {
  slug: AlgorithmCategory;
  nameKey: string;
};

const NAV_CATEGORIES: NavCategory[] = [
  { slug: 'sorting', nameKey: 'categories.sorting.name' },
  { slug: 'searching', nameKey: 'categories.searching.name' },
  { slug: 'graph', nameKey: 'categories.graph.name' },
  { slug: 'tree', nameKey: 'categories.tree.name' },
  {
    slug: 'dynamic-programming',
    nameKey: 'categories.dynamic-programming.name',
  },
  { slug: 'string-matching', nameKey: 'categories.string-matching.name' },
  { slug: 'backtracking', nameKey: 'categories.backtracking.name' },
  { slug: 'math', nameKey: 'categories.math.name' },
];

const LANGUAGES: { value: Language; flag: string }[] = [
  { value: 'en', flag: '🇬🇧' },
  { value: 'id', flag: '🇮🇩' },
];

export function Layout() {
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const location = useLocation();

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-200 flex-shrink-0 ${
          collapsed ? 'w-14' : 'w-64'
        }`}
      >
        {/* Title — links to home */}
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-4 min-h-14 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          title={t('nav.home_tooltip')}
        >
          <span className="flex-shrink-0 text-[var(--color-turquoise)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">
              {t('site.title')}
            </span>
          )}
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_CATEGORIES.map((cat) => {
            const isActive =
              location.pathname === `/${cat.slug}` ||
              location.pathname.startsWith(`/${cat.slug}/`);

            return (
              <div key={cat.slug} className="relative group">
                <NavLink
                  to={`/${cat.slug}`}
                  className={({ isActive: navActive }) =>
                    navActive || isActive
                      ? 'nav-link-active'
                      : 'nav-link-inactive'
                  }
                >
                  <span className="flex-shrink-0">
                    <CategoryIcon category={cat.slug} />
                  </span>
                  {!collapsed && (
                    <span className="truncate">{t(cat.nameKey)}</span>
                  )}
                </NavLink>

                {/* Collapsed tooltip */}
                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {t(cat.nameKey)}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer: language selector + theme + collapse */}
        <div className="border-t border-gray-100 dark:border-gray-700 p-2 space-y-1">
          {/* Language buttons */}
          <div
            className={`flex items-center gap-1 px-1 ${collapsed ? 'justify-center' : ''}`}
          >
            {LANGUAGES.map(({ value, flag }) => (
              <button
                key={value}
                onClick={() => setLanguage(value)}
                title={t(`language.${value}`)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  language === value
                    ? 'bg-[var(--color-turquoise)] text-white'
                    : 'btn-sidebar-action px-2 py-1 w-auto'
                }`}
              >
                <span>{flag}</span>
                {!collapsed && <span>{value.toUpperCase()}</span>}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-sidebar-action"
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            {theme === 'dark' ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <circle
                  cx={12}
                  cy={12}
                  r={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {!collapsed && (
              <span className="text-xs">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            )}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="btn-sidebar-action"
            aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {!collapsed && <span className="text-xs">{t('nav.collapse')}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
}
