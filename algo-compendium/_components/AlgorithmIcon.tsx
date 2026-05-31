import type { AlgorithmCategory } from '../_algorithms/_shared/types';
import { CategoryIcon } from './CategoryIcon';

export function AlgorithmIcon({
  category,
  slug: _slug, // reserved for future per-algorithm icons
  className,
}: {
  category: AlgorithmCategory;
  slug: string;
  className?: string;
}) {
  void _slug;
  return <CategoryIcon category={category} className={className} />;
}
