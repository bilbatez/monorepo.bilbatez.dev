import { useCallback, useState, useEffect } from 'react';
import { useAlgorithmPlayer } from '../_components/hooks/useAlgorithmPlayer';
import { Controls } from '../_components/Controls';
import { LegendRow } from '../_components/composed/LegendRow';
import { TargetIndicator } from '../_components/composed/TargetIndicator';
import { useI18n } from '../app/_i18n';
import type { SortCommand, SortState } from '../_algorithms/sorting/commands';
import { makeSortState, sortReducer } from '../_algorithms/sorting/commands';
import type {
  SearchCommand,
  SearchState,
} from '../_algorithms/searching/commands';
import {
  makeSearchState,
  searchReducer,
} from '../_algorithms/searching/commands';

// ─── Sort mode ───────────────────────────────────────────────────────────────

type SortProps = {
  mode: 'sort';
  commands: SortCommand[];
  initialState: SortState;
  onNewCommands: (commands: SortCommand[], newState: SortState) => void;
  generateCommands: (arr: number[]) => SortCommand[];
};

// ─── Search mode ─────────────────────────────────────────────────────────────

type SearchProps = {
  mode: 'search';
  commands: SearchCommand[];
  initialState: SearchState;
  onNewCommands: (commands: SearchCommand[], newState: SearchState) => void;
  generateCommands: (arr: number[], target: number) => SearchCommand[];
};

type Props = SortProps | SearchProps;

// ─── Component ───────────────────────────────────────────────────────────────

export function ArrayVisualizer(props: Props) {
  if (props.mode === 'search') {
    return <SearchArrayVisualizer {...props} />;
  }
  return <SortArrayVisualizer {...props} />;
}

// ─── Sort visualizer ─────────────────────────────────────────────────────────

function SortArrayVisualizer({
  commands,
  initialState,
  onNewCommands,
  generateCommands,
}: Omit<SortProps, 'mode'>) {
  const { t } = useI18n();
  const player = useAlgorithmPlayer(initialState, commands, sortReducer);
  const [inputValue, setInputValue] = useState(() =>
    initialState.array.join(', ')
  );

  useEffect(() => {
    setInputValue(initialState.array.join(', '));
  }, [initialState]);

  const handleRandomize = useCallback(() => {
    const arr = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 90) + 10
    );
    setInputValue(arr.join(', '));
    const newState = makeSortState(arr);
    const newCommands = generateCommands(arr);
    onNewCommands(newCommands, newState);
  }, [generateCommands, onNewCommands]);

  const handleCustomInput = useCallback(
    (value: string) => {
      const arr = value
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n > 0 && n <= 1000);
      if (arr.length < 2) return;
      const newState = makeSortState(arr);
      const newCommands = generateCommands(arr);
      onNewCommands(newCommands, newState);
    },
    [generateCommands, onNewCommands]
  );

  const { currentState } = player;
  const maxVal = Math.max(...currentState.array, 1);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Bar chart */}
      <div className="flex items-end gap-1 h-48 viz-surface p-3">
        {currentState.array.map((val, i) => {
          let color = 'bg-gray-300';
          if (currentState.pivot === i) color = 'bg-purple-500';
          else if (currentState.swapping.includes(i)) color = 'bg-orange-400';
          else if (currentState.comparing.includes(i)) color = 'bg-yellow-400';
          else if (currentState.sorted.includes(i))
            color = 'bg-[var(--color-turquoise)]';
          const height = Math.max(4, Math.round((val / maxVal) * 100));
          return (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-100 ${color}`}
              style={{ height: `${height}%` }}
              title={String(val)}
            />
          );
        })}
      </div>

      <LegendRow
        items={[
          {
            dotClass: 'bg-gray-300',
            label: t('visualizer.sort_legend.unsorted'),
          },
          {
            dotClass: 'bg-yellow-400',
            label: t('visualizer.sort_legend.comparing'),
          },
          {
            dotClass: 'bg-orange-400',
            label: t('visualizer.sort_legend.swapping'),
          },
          {
            dotClass: 'bg-purple-500',
            label: t('visualizer.sort_legend.pivot'),
          },
          {
            dotClass: 'bg-[var(--color-turquoise)]',
            label: t('visualizer.sort_legend.sorted'),
          },
        ]}
      />

      {/* Controls */}
      <Controls
        index={player.index}
        totalCommands={player.totalCommands}
        isPlaying={player.isPlaying}
        speed={player.speed}
        description={currentState.description}
        onPlay={player.play}
        onPause={player.pause}
        onStepBack={player.stepBack}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onSpeedChange={player.setSpeed}
        onJumpTo={player.jumpTo}
        inputValue={inputValue}
        onRandomize={handleRandomize}
        onCustomInput={handleCustomInput}
        customInputPlaceholder="e.g. 64,34,25,12,22"
      />
    </div>
  );
}

// ─── Search visualizer ───────────────────────────────────────────────────────

function SearchArrayVisualizer({
  commands,
  initialState,
  onNewCommands,
  generateCommands,
}: Omit<SearchProps, 'mode'>) {
  const { t } = useI18n();
  const player = useAlgorithmPlayer(initialState, commands, searchReducer);
  const [inputValue, setInputValue] = useState(
    () => `${initialState.target};${initialState.array.join(', ')}`
  );

  useEffect(() => {
    setInputValue(`${initialState.target};${initialState.array.join(', ')}`);
  }, [initialState]);

  const handleRandomize = useCallback(() => {
    // Generate a sorted random array for search algorithms
    const arr = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 90) + 10
    )
      .sort((a, b) => a - b)
      // Deduplicate
      .filter((v, i, a) => i === 0 || v !== a[i - 1]);
    // Pick a random target that exists in the array
    const target = arr[Math.floor(Math.random() * arr.length)];
    setInputValue(`${target};${arr.join(', ')}`);
    const newState = makeSearchState(arr, target);
    const newCommands = generateCommands(arr, target);
    onNewCommands(newCommands, newState);
  }, [generateCommands, onNewCommands]);

  const handleCustomInput = useCallback(
    (value: string) => {
      // Format: "target;v1,v2,v3" or just "v1,v2,v3" (picks middle as target)
      const parts = value.split(';');
      let arr: number[];
      let target: number;
      if (parts.length >= 2) {
        arr = parts[1]
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n) && n > 0 && n <= 1000)
          .sort((a, b) => a - b);
        target = parseInt(parts[0].trim(), 10);
      } else {
        arr = parts[0]
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n) && n > 0 && n <= 1000)
          .sort((a, b) => a - b);
        target = arr[Math.floor(arr.length / 2)] ?? arr[0];
      }
      if (arr.length < 1 || isNaN(target)) return;
      const newState = makeSearchState(arr, target);
      const newCommands = generateCommands(arr, target);
      onNewCommands(newCommands, newState);
    },
    [generateCommands, onNewCommands]
  );

  const { currentState } = player;
  const maxVal = Math.max(...currentState.array, 1);

  return (
    <div className="flex flex-col gap-4 w-full">
      <TargetIndicator
        label={t('visualizer.search_legend.target')}
        value={currentState.target}
        foundMessage={
          currentState.found !== null
            ? `${t('visualizer.search_legend.found_at_index')} ${currentState.found}`
            : null
        }
      />

      {/* Bar chart */}
      <div className="flex items-end gap-1 h-48 viz-surface p-3">
        {currentState.array.map((val, i) => {
          let color = 'bg-gray-300';
          if (currentState.found === i) {
            color = 'bg-green-500';
          } else if (currentState.mid === i) {
            color = 'bg-purple-500';
          } else if (currentState.current === i) {
            color = 'bg-yellow-400';
          } else if (currentState.eliminated.includes(i)) {
            color = 'bg-gray-100';
          } else if (currentState.low === i || currentState.high === i) {
            color = 'bg-orange-300';
          }
          const height = Math.max(4, Math.round((val / maxVal) * 100));
          return (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-100 ${color}`}
              style={{ height: `${height}%` }}
              title={`[${i}] = ${val}`}
            />
          );
        })}
      </div>

      <LegendRow
        items={[
          {
            dotClass: 'bg-gray-300',
            label: t('visualizer.search_legend.unsearched'),
          },
          {
            dotClass: 'bg-yellow-400',
            label: t('visualizer.search_legend.current'),
          },
          {
            dotClass: 'bg-purple-500',
            label: t('visualizer.search_legend.midpoint'),
          },
          {
            dotClass: 'bg-orange-300',
            label: t('visualizer.search_legend.bounds'),
          },
          {
            dotClass: 'bg-gray-100 border border-gray-300',
            label: t('visualizer.search_legend.eliminated'),
          },
          {
            dotClass: 'bg-green-500',
            label: t('visualizer.search_legend.found'),
          },
        ]}
      />

      {/* Controls */}
      <Controls
        index={player.index}
        totalCommands={player.totalCommands}
        isPlaying={player.isPlaying}
        speed={player.speed}
        description={currentState.description}
        onPlay={player.play}
        onPause={player.pause}
        onStepBack={player.stepBack}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onSpeedChange={player.setSpeed}
        onJumpTo={player.jumpTo}
        inputValue={inputValue}
        onRandomize={handleRandomize}
        onCustomInput={handleCustomInput}
        customInputPlaceholder="e.g. 45;11,21,34,39,45,56 or just 11,21,34,39,45,56"
      />
    </div>
  );
}
