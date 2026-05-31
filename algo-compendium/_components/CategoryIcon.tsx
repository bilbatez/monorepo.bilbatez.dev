import type { ReactElement } from 'react';
import type { AlgorithmCategory } from '../_algorithms/_shared/types';

const ICONS: Record<AlgorithmCategory, ReactElement> = {
  sorting: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
    </svg>
  ),
  searching: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  graph: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M7 12h10M17 6.5l-10 4M17 17.5l-10-4" />
    </svg>
  ),
  tree: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <circle cx="12" cy="4" r="2" />
      <circle cx="6" cy="16" r="2" />
      <circle cx="18" cy="16" r="2" />
      <path d="M12 6v4M10 14l-2.5-4M14 14l2.5-4" />
    </svg>
  ),
  'dynamic-programming': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  'string-matching': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path d="M4 7h16M4 12h10M4 17h6" strokeLinecap="round" />
      <path d="M17 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  backtracking: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path
        d="M12 4v8M8 8l4-4 4 4M8 16l4 4 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  math: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path
        d="M4 19 20 5M15 5h5v5M4 9h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function CategoryIcon({
  category,
  className,
}: {
  category: AlgorithmCategory;
  className?: string;
}) {
  const icon = ICONS[category];
  if (!icon) return null;
  return <span className={className}>{icon}</span>;
}
