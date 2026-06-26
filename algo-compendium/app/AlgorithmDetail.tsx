import { useState, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useI18n, tOr } from './_i18n';
import type { AlgorithmCategory } from '../_algorithms/_shared/types';
import { getAlgorithm } from '../_algorithms/registry';
import { AlgorithmIcon } from '../_components/AlgorithmIcon';
import { MetadataPanel } from '../_components/MetadataPanel';
import { CollapsibleSection } from '../_components/composed/CollapsibleSection';
import { StaticSection } from '../_components/composed/StaticSection';
import { ArrayVisualizer } from '../_visualizers/ArrayVisualizer';
import { TreeVisualizer } from '../_visualizers/TreeVisualizer';
import { GraphVisualizer } from '../_visualizers/GraphVisualizer';
import { GridVisualizer } from '../_visualizers/GridVisualizer';
import { StringVisualizer } from '../_visualizers/StringVisualizer';
import { MathVisualizer } from '../_visualizers/MathVisualizer';
import type { MathCommand, MathState } from '../_algorithms/math/commands';
import type { SortCommand, SortState } from '../_algorithms/sorting/commands';
import { makeSortState } from '../_algorithms/sorting/commands';
import type {
  SearchCommand,
  SearchState,
} from '../_algorithms/searching/commands';
import { makeSearchState } from '../_algorithms/searching/commands';
import type { TreeCommand, TreeState } from '../_algorithms/tree/commands';
import type { GraphCommand, GraphState } from '../_algorithms/graph/commands';
import type {
  GridCommand,
  GridState,
} from '../_algorithms/dynamic-programming/commands';
import type {
  StringCommand,
  StringState,
} from '../_algorithms/string-matching/commands';

export function AlgorithmDetail() {
  const { t } = useI18n();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const category = location.pathname.split('/').filter(Boolean)[0];
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!category || !slug) {
    return <NotFoundMessage t={t} />;
  }

  const algo = getAlgorithm(category as AlgorithmCategory, slug);

  if (!algo) {
    return <NotFoundMessage t={t} />;
  }

  const algoName = tOr(t, `algorithms.${algo.slug}.name`, algo.name);
  const algoDescription = tOr(
    t,
    `algorithms.${algo.slug}.description`,
    algo.description
  );
  const categoryName = tOr(
    t,
    `categories.${algo.category}.name`,
    algo.category
  );

  return (
    <div className="page-container dark:text-gray-100">
      {/* Header */}
      <div className="flex items-start gap-4">
        <span className="text-[var(--color-turquoise)] mt-1">
          <AlgorithmIcon
            category={algo.category}
            slug={algo.slug}
            className="[&_svg]:w-8 [&_svg]:h-8"
          />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {algoName}
            </h1>
            <Link
              to={`/${algo.category}`}
              className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-[var(--color-turquoise-light)]/30 text-[var(--color-turquoise-dark)] hover:bg-[var(--color-turquoise-light)]/50 transition-colors"
            >
              {categoryName}
            </Link>
          </div>
        </div>
      </div>

      <CollapsibleSection
        title={t('detail.overview')}
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="icon-accent"
          >
            <path
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        open={detailsOpen}
        onToggle={() => setDetailsOpen((v) => !v)}
        bodyClass="space-y-4"
      >
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {algoDescription}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="label-caps">{t('detail.complexity')}</p>
            <MetadataPanel meta={algo} />
          </div>
          <div>
            <p className="label-caps">{t('detail.pseudocode')}</p>
            <pre className="text-sm font-mono text-gray-700 dark:text-gray-200 viz-surface p-4 whitespace-pre-wrap overflow-x-auto leading-relaxed">
              {algo.pseudocode}
            </pre>
          </div>
        </div>
      </CollapsibleSection>

      <StaticSection
        title={t('detail.visualizer')}
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="icon-accent"
          >
            <path
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        {algo.visualizerType === 'array' && algo.category === 'searching' ? (
          <SearchArrayVisualizerWrapper algo={algo} />
        ) : algo.visualizerType === 'array' ? (
          <ArrayVisualizerWrapper algo={algo} />
        ) : algo.visualizerType === 'tree' ? (
          <TreeVisualizerWrapper algo={algo} />
        ) : algo.visualizerType === 'graph' ? (
          <GraphVisualizerWrapper algo={algo} />
        ) : algo.visualizerType === 'grid' ? (
          <GridVisualizerWrapper algo={algo} />
        ) : algo.visualizerType === 'string' ? (
          <StringVisualizerWrapper algo={algo} />
        ) : algo.visualizerType === 'math' ? (
          <MathVisualizerWrapper algo={algo} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-48 text-center gap-2">
            <p className="text-gray-400 font-medium">
              {t('visualizer.coming_soon')}
            </p>
          </div>
        )}
      </StaticSection>
    </div>
  );
}

// Wrapper component that manages commands/state for the ArrayVisualizer
function ArrayVisualizerWrapper({
  algo,
}: {
  algo: NonNullable<ReturnType<typeof getAlgorithm>>;
}) {
  const { t } = useI18n();
  const [commands, setCommands] = useState<SortCommand[]>(
    () => algo.run(algo.defaultInput) as SortCommand[]
  );
  const [initialState, setInitialState] = useState<SortState>(
    () => algo.defaultInput as SortState
  );

  const handleNewCommands = useCallback(
    (newCommands: SortCommand[], newState: SortState) => {
      setCommands(newCommands);
      setInitialState(newState);
    },
    []
  );

  const generateCommands = useCallback(
    (arr: number[]) => {
      return algo.run(makeSortState(arr)) as SortCommand[];
    },
    [algo]
  );

  const pivotLabel = algo.legendLabels?.pivot
    ? t(`visualizer.sort_legend.${algo.legendLabels.pivot}`)
    : undefined;

  return (
    <ArrayVisualizer
      mode="sort"
      commands={commands}
      initialState={initialState}
      onNewCommands={handleNewCommands}
      generateCommands={generateCommands}
      pivotLabel={pivotLabel}
    />
  );
}

// Wrapper component that manages commands/state for the search ArrayVisualizer
function SearchArrayVisualizerWrapper({
  algo,
}: {
  algo: NonNullable<ReturnType<typeof getAlgorithm>>;
}) {
  const [commands, setCommands] = useState<SearchCommand[]>(
    () => algo.run(algo.defaultInput) as SearchCommand[]
  );
  const [initialState, setInitialState] = useState<SearchState>(
    () => algo.defaultInput as SearchState
  );

  const handleNewCommands = useCallback(
    (newCommands: SearchCommand[], newState: SearchState) => {
      setCommands(newCommands);
      setInitialState(newState);
    },
    []
  );

  const generateCommands = useCallback(
    (arr: number[], target: number) => {
      return algo.run(makeSearchState(arr, target)) as SearchCommand[];
    },
    [algo]
  );

  return (
    <ArrayVisualizer
      mode="search"
      commands={commands}
      initialState={initialState}
      onNewCommands={handleNewCommands}
      generateCommands={generateCommands}
    />
  );
}

// Wrapper component for the TreeVisualizer
function TreeVisualizerWrapper({
  algo,
}: {
  algo: NonNullable<ReturnType<typeof getAlgorithm>>;
}) {
  const [commands] = useState<TreeCommand[]>(
    () => algo.run(algo.defaultInput) as TreeCommand[]
  );
  const [initialState] = useState<TreeState>(
    () => algo.defaultInput as TreeState
  );

  return <TreeVisualizer commands={commands} initialState={initialState} />;
}

// Wrapper component for the GraphVisualizer
function GraphVisualizerWrapper({
  algo,
}: {
  algo: NonNullable<ReturnType<typeof getAlgorithm>>;
}) {
  const [commands] = useState<GraphCommand[]>(
    () => algo.run(algo.defaultInput) as GraphCommand[]
  );
  const [initialState] = useState<GraphState>(
    () => algo.defaultInput as GraphState
  );

  return <GraphVisualizer commands={commands} initialState={initialState} />;
}

// Wrapper component for the GridVisualizer
function GridVisualizerWrapper({
  algo,
}: {
  algo: NonNullable<ReturnType<typeof getAlgorithm>>;
}) {
  const [commands] = useState<GridCommand[]>(
    () => algo.run(algo.defaultInput) as GridCommand[]
  );
  const [initialState] = useState<GridState>(
    () => algo.defaultInput as GridState
  );

  return (
    <GridVisualizer
      commands={commands}
      initialState={initialState}
      reduce={algo.reduce as (state: GridState, cmd: GridCommand) => GridState}
    />
  );
}

// Wrapper component for the StringVisualizer
function StringVisualizerWrapper({
  algo,
}: {
  algo: NonNullable<ReturnType<typeof getAlgorithm>>;
}) {
  const [commands] = useState<StringCommand[]>(
    () => algo.run(algo.defaultInput) as StringCommand[]
  );
  const [initialState] = useState<StringState>(
    () => algo.defaultInput as StringState
  );

  return <StringVisualizer commands={commands} initialState={initialState} />;
}

// Wrapper component for the MathVisualizer
function MathVisualizerWrapper({
  algo,
}: {
  algo: NonNullable<ReturnType<typeof getAlgorithm>>;
}) {
  const [commands] = useState<MathCommand[]>(
    () => algo.run(algo.defaultInput) as MathCommand[]
  );
  const [initialState] = useState<MathState>(
    () => algo.defaultInput as MathState
  );

  return <MathVisualizer commands={commands} initialState={initialState} />;
}

function NotFoundMessage({ t }: { t: (k: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        {t('detail.not_found')}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {t('detail.not_found_desc')}
      </p>
      <Link to="/" className="text-[var(--color-turquoise)] hover:underline">
        {t('detail.back_home')}
      </Link>
    </div>
  );
}
