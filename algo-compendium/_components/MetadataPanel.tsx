import type { AlgorithmMeta } from '../_algorithms/_shared/types';
import { Badge } from './primitives/Badge';
import { useI18n } from '../app/_i18n';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MetadataPanel({ meta }: { meta: AlgorithmMeta<any, any> }) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <table className="w-full text-sm">
        <tbody>
          <tr>
            <td className="text-gray-500 dark:text-gray-400 pr-4">
              {t('complexity.best')}
            </td>
            <td className="font-mono dark:text-gray-200">{meta.bestCase}</td>
          </tr>
          <tr>
            <td className="text-gray-500 dark:text-gray-400 pr-4">
              {t('complexity.average')}
            </td>
            <td className="font-mono dark:text-gray-200">{meta.averageCase}</td>
          </tr>
          <tr>
            <td className="text-gray-500 dark:text-gray-400 pr-4">
              {t('complexity.worst')}
            </td>
            <td className="font-mono dark:text-gray-200">{meta.worstCase}</td>
          </tr>
          <tr>
            <td className="text-gray-500 dark:text-gray-400 pr-4">
              {t('complexity.space')}
            </td>
            <td className="font-mono dark:text-gray-200">
              {meta.spaceComplexity}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-2 flex-wrap">
        {meta.stable !== undefined && (
          <Badge variant={meta.stable ? 'stable' : 'unstable'}>
            {meta.stable ? t('complexity.stable') : t('complexity.unstable')}
          </Badge>
        )}
        {meta.inPlace !== undefined && (
          <Badge variant={meta.inPlace ? 'in-place' : 'extra-space'}>
            {meta.inPlace
              ? t('complexity.in_place')
              : t('complexity.extra_space')}
          </Badge>
        )}
      </div>
    </div>
  );
}
