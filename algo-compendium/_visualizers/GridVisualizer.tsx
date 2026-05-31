import { useAlgorithmPlayer } from '../_components/hooks/useAlgorithmPlayer';
import { Controls } from '../_components/Controls';
import { useI18n } from '../app/_i18n';
import type {
  GridState,
  GridCommand,
} from '../_algorithms/dynamic-programming/commands';
import { gridReducer } from '../_algorithms/dynamic-programming/commands';

type Props = {
  commands: GridCommand[];
  initialState: GridState;
  reduce?: (state: GridState, cmd: GridCommand) => GridState;
};

export function GridVisualizer({ commands, initialState, reduce }: Props) {
  const { t } = useI18n();
  const player = useAlgorithmPlayer(
    initialState,
    commands,
    reduce ?? gridReducer
  );
  const { currentState } = player;

  return (
    <div className="flex flex-col gap-4">
      <div className="viz-surface p-3 overflow-auto max-h-64">
        <table className="text-xs border-collapse">
          {/* Column headers */}
          <thead>
            <tr>
              <th className="w-8" />
              {currentState.colLabels.map((label, c) => (
                <th
                  key={c}
                  className="px-2 py-1 text-gray-500 dark:text-gray-300 font-normal text-center border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 min-w-8"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentState.grid.map((row, r) => (
              <tr key={r}>
                <td className="px-2 py-1 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-center">
                  {currentState.rowLabels[r]}
                </td>
                {row.map((cell, c) => {
                  const isHighlighted =
                    currentState.highlighted?.[0] === r &&
                    currentState.highlighted?.[1] === c;
                  const isTrace = currentState.tracePath.some(
                    ([tr, tc]) => tr === r && tc === c
                  );
                  let bg = 'bg-white dark:bg-gray-800';
                  if (isTrace) bg = 'bg-[var(--color-turquoise-light)]';
                  else if (isHighlighted) bg = 'bg-yellow-200';
                  else if (cell.computed) bg = 'bg-blue-50';
                  return (
                    <td
                      key={c}
                      className={`px-2 py-1 border border-gray-200 dark:border-gray-600 text-center font-mono dark:text-gray-200 ${bg} transition-colors`}
                    >
                      {cell.value !== null ? cell.value : '–'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {currentState.result !== null && (
        <div className="text-sm font-medium text-[var(--color-turquoise-dark)]">
          {t('visualizer.grid.result_label')} {currentState.result}
        </div>
      )}
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
      />
    </div>
  );
}
