import { useAlgorithmPlayer } from '../_components/hooks/useAlgorithmPlayer';
import { Controls } from '../_components/Controls';
import type { MathState, MathCommand } from '../_algorithms/math/commands';
import { mathReducer } from '../_algorithms/math/commands';
import { useI18n } from '../app/_i18n';

type Props = { commands: MathCommand[]; initialState: MathState };

export function MathVisualizer({ commands, initialState }: Props) {
  const { t } = useI18n();
  const player = useAlgorithmPlayer(initialState, commands, mathReducer);
  const { currentState } = player;

  return (
    <div className="flex flex-col gap-4">
      {/* Sieve grid: when numbers.length > 0 */}
      {currentState.numbers.length > 0 && (
        <div className="viz-surface p-3">
          <div className="flex flex-wrap gap-1">
            {currentState.numbers.map((num, i) => {
              let bg =
                'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600';
              if (num < 2)
                bg =
                  'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600';
              else if (currentState.highlighted === i)
                bg = 'bg-yellow-300 border border-yellow-400';
              else if (currentState.primes.includes(i))
                bg =
                  'bg-[var(--color-turquoise)] border-transparent text-white';
              else if (currentState.composites.includes(i))
                bg = 'bg-red-100 border border-red-200 text-gray-400';
              return (
                <div
                  key={i}
                  className={`w-10 h-10 flex items-center justify-center rounded text-sm font-mono font-medium ${bg}`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step list: when steps.length > 0 */}
      {currentState.steps.length > 0 && (
        <div className="viz-surface p-3">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            {t('visualizer.math.steps_label')}
          </div>
          <div className="space-y-1">
            {currentState.steps.map((step, i) => (
              <div
                key={i}
                className="text-sm font-mono text-gray-700 dark:text-gray-300"
              >
                gcd({step.a}, {step.b}) — remainder: {step.remainder}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sequence display: when sequence.length > 0 */}
      {currentState.sequence.length > 0 && (
        <div className="viz-surface p-3">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            {t('visualizer.math.sequence_label')}
          </div>
          <div className="flex gap-2 flex-wrap">
            {currentState.sequence.map((val, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-[var(--color-turquoise-light)] rounded font-mono text-sm font-medium">
                  {val}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
                  F({i})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Binary steps: when binarySteps.length > 0 */}
      {currentState.binarySteps.length > 0 && (
        <div className="viz-surface p-3">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            {t('visualizer.math.binary_steps_label')}
          </div>
          <div className="space-y-1">
            {currentState.binarySteps.map((s, i) => (
              <div
                key={i}
                className="text-sm font-mono text-gray-700 dark:text-gray-300"
              >
                bit={s.bit} current={s.current} result={s.result}
              </div>
            ))}
          </div>
        </div>
      )}

      {currentState.result !== null && (
        <div className="text-sm font-medium text-[var(--color-turquoise-dark)]">
          {t('visualizer.math.result_label')} {currentState.result}
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
