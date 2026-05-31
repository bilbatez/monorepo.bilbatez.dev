import { Link } from 'react-router-dom';
import { CategoryIcon } from '../_components/CategoryIcon';
import type { AlgorithmCategory } from '../_algorithms/_shared/types';
import { getAlgorithmsByCategory } from '../_algorithms/registry';
import { useI18n } from './_i18n';

const CATEGORY_SLUGS: AlgorithmCategory[] = [
  'sorting',
  'searching',
  'graph',
  'tree',
  'dynamic-programming',
  'string-matching',
  'backtracking',
  'math',
];

export function Home() {
  const { t } = useI18n();

  return (
    <div className="page-container">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {t('site.title')}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {t('site.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CATEGORY_SLUGS.map((slug) => {
          const count = getAlgorithmsByCategory(slug).length;
          return (
            <Link key={slug} to={`/${slug}`} className="card-link group">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-turquoise)] group-hover:text-[var(--color-turquoise-dark)] transition-colors">
                  <CategoryIcon category={slug} />
                </span>
                <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[var(--color-turquoise)] transition-colors">
                  {t(`categories.${slug}.name`)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                  {t(`categories.${slug}.description`)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
