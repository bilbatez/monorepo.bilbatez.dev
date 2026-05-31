import type { ReactNode } from 'react';

type Props = {
  title: string;
  icon?: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  bodyClass?: string;
};

export function CollapsibleSection({
  title,
  icon,
  open,
  onToggle,
  children,
  bodyClass = '',
}: Props) {
  return (
    <div className="card-section">
      <button onClick={onToggle} className="section-toggle">
        <span className="section-title">
          {icon}
          {title}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`section-chevron ${open ? '' : '-rotate-90'}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className={`section-body ${bodyClass}`}>{children}</div>}
    </div>
  );
}
