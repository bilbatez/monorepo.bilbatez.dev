import type { ReactNode } from 'react';

type Variant = 'stable' | 'unstable' | 'in-place' | 'extra-space';

const VARIANT_CLASS: Record<Variant, string> = {
  stable: 'badge-stable',
  unstable: 'badge-unstable',
  'in-place': 'badge-in-place',
  'extra-space': 'badge-extra-space',
};

type Props = { variant: Variant; children: ReactNode };

export function Badge({ variant, children }: Props) {
  return <span className={VARIANT_CLASS[variant]}>{children}</span>;
}
