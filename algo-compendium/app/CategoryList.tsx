import { Link } from 'react-router-dom';
import type { AlgorithmCategory } from '../_algorithms/_shared/types';
import { getAlgorithmsByCategory } from '../_algorithms/registry';
import { AlgorithmIcon } from '../_components/AlgorithmIcon';
import { useI18n, tOr } from './_i18n';

export function CategoryList({ category }: { category: AlgorithmCategory }) {
  const { t } = useI18n();
  const algorithms = getAlgorithmsByCategory(category);

  return (
    <div className="page-container-narrow">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t(`categories.${category}.name`)}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t(`categories.${category}.description`)}
        </p>
      </div>

      {algorithms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-lg">
            {t('category_list.coming_soon')}
          </p>
          <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">
            {t('category_list.coming_soon_desc')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {algorithms.map((algo) => (
            <Link
              key={algo.slug}
              to={`/${category}/${algo.slug}`}
              className="card-link group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-turquoise)] group-hover:text-[var(--color-turquoise-dark)] transition-colors">
                  <AlgorithmIcon category={algo.category} slug={algo.slug} />
                </span>
                <h2 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[var(--color-turquoise)] transition-colors">
                  {tOr(t, `algorithms.${algo.slug}.name`, algo.name)}
                </h2>
              </div>
              <p className="font-mono text-sm text-gray-400 dark:text-gray-500 flex items-baseline gap-1.5">
                <span className="label-caps-inline">
                  {t('category_list.avg_label')}
                </span>
                {algo.averageCase}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
