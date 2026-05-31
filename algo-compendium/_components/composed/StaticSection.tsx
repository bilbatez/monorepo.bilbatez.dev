import type { ReactNode } from 'react';

type Props = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
};

export function StaticSection({ title, icon, children }: Props) {
  return (
    <div className="card-section">
      <div className="section-header-row">
        {icon}
        <span className="section-header-title">{title}</span>
      </div>
      <div className="section-content">{children}</div>
    </div>
  );
}
