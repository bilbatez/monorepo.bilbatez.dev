import { useAlgorithmPlayer } from '../_components/hooks/useAlgorithmPlayer';
import { Controls } from '../_components/Controls';
import type {
  StringState,
  StringCommand,
} from '../_algorithms/string-matching/commands';
import { stringReducer } from '../_algorithms/string-matching/commands';
import { useI18n } from '../app/_i18n';

type Props = { commands: StringCommand[]; initialState: StringState };

export function StringVisualizer({ commands, initialState }: Props) {
  const { t } = useI18n();
  const player = useAlgorithmPlayer(initialState, commands, stringReducer);
  const { currentState } = player;

  function getCharBg(i: number): string {
    if (
      currentState.foundAt.some(
        (at) => i >= at && i < at + currentState.pattern.length
      )
    )
      return 'bg-[var(--color-turquoise)] text-white';
    if (currentState.matchedChars.includes(i)) return 'bg-green-300';
    if (currentState.mismatchedChars.includes(i)) return 'bg-red-300';
    if (currentState.currentTextIndex === i) return 'bg-yellow-300';
    return 'bg-gray-100 dark:bg-gray-700';
  }

  function getPatternCharBg(j: number): string {
    if (currentState.currentPatternIndex === j) return 'bg-yellow-300';
    return 'bg-blue-100 dark:bg-blue-900';
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="viz-surface p-4 overflow-x-auto">
        {/* Text row */}
        <div className="mb-2">
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
            {t('visualizer.string.text_label')}
          </div>
          <div className="flex gap-1">
            {currentState.text.split('').map((char, i) => (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded font-mono text-sm font-medium transition-colors ${getCharBg(i)}`}
              >
                {char}
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-0.5">
            {currentState.text.split('').map((_, i) => (
              <div
                key={i}
                className="w-8 text-center text-xs text-gray-400 dark:text-gray-500"
              >
                {i}
              </div>
            ))}
          </div>
        </div>
        {/* Pattern row — offset by currentState.offset */}
        <div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
            {t('visualizer.string.pattern_label')} {currentState.offset})
          </div>
          <div
            className="flex gap-1"
            style={{ marginLeft: currentState.offset * 36 }}
          >
            {currentState.pattern.split('').map((char, j) => (
              <div
                key={j}
                className={`w-8 h-8 flex items-center justify-center rounded font-mono text-sm font-medium ${getPatternCharBg(j)}`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      </div>
      {currentState.foundAt.length > 0 && (
        <div className="text-sm text-[var(--color-turquoise-dark)] font-medium">
          {t('visualizer.string.found_at')} {currentState.foundAt.join(', ')}
        </div>
      )}
      {/* Show failure table if available (KMP) */}
      {currentState.failureTable.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Failure table: [{currentState.failureTable.join(', ')}]
        </div>
      )}
      {currentState.textHash !== null && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Text window hash: {currentState.textHash} | Pattern hash:{' '}
          {currentState.patternHash}
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
