import { useState, useEffect } from 'react';
import { useI18n } from '../app/_i18n';

type ControlsProps = {
  index: number;
  totalCommands: number;
  isPlaying: boolean;
  speed: number;
  description?: string;
  inputValue?: string;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onJumpTo: (index: number) => void;
  onRandomize?: () => void;
  onCustomInput?: (value: string) => void;
  customInputPlaceholder?: string;
};

export function Controls({
  index,
  totalCommands,
  isPlaying,
  speed,
  description,
  inputValue,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReset,
  onSpeedChange,
  onJumpTo,
  onRandomize,
  onCustomInput,
  customInputPlaceholder = 'Custom input…',
}: ControlsProps) {
  const { t } = useI18n();
  const [customValue, setCustomValue] = useState(inputValue ?? '');

  useEffect(() => {
    if (inputValue !== undefined) setCustomValue(inputValue);
  }, [inputValue]);

  const progressValue = Math.max(0, index);
  const progressMax = Math.max(0, totalCommands - 1);

  return (
    <div className="controls-wrapper">
      {/* Playback buttons + speed */}
      <div className="controls-row">
        {isPlaying ? (
          <button onClick={onPause} className="btn-primary" aria-label="Pause">
            {t('controls.pause')}
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={totalCommands === 0}
            className="btn-primary"
            aria-label="Play"
          >
            {t('controls.play')}
          </button>
        )}

        <button
          onClick={onStepBack}
          disabled={index <= -1}
          className="btn-secondary"
          aria-label="Step back"
        >
          ◀
        </button>

        <button
          onClick={onStepForward}
          disabled={index >= totalCommands - 1}
          className="btn-secondary"
          aria-label="Step forward"
        >
          ▶
        </button>

        <button onClick={onReset} className="btn-secondary" aria-label="Reset">
          {t('controls.reset')}
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          <label className="text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
            {t('controls.speed')}: {speed}x
          </label>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-24 accent-[var(--color-turquoise)]"
            aria-label="Playback speed"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="controls-row">
        <span className="text-xs font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
          {t('controls.steps')}
        </span>
        <span className="text-xs tabular-nums w-8 text-right text-gray-400 dark:text-gray-500">
          {index + 1}
        </span>
        <input
          type="range"
          min={0}
          max={progressMax}
          value={progressValue}
          onChange={(e) => onJumpTo(Number(e.target.value))}
          disabled={totalCommands === 0}
          className="flex-1 accent-[var(--color-turquoise)] disabled:opacity-40"
          aria-label="Progress"
        />
        <span className="text-xs tabular-nums w-8 text-gray-400 dark:text-gray-500">
          {totalCommands}
        </span>
      </div>

      {/* Randomize / custom input */}
      {(onRandomize || onCustomInput) && (
        <div className="controls-row">
          {onRandomize && (
            <button onClick={onRandomize} className="btn-secondary">
              {t('controls.randomize')}
            </button>
          )}
          {onCustomInput && (
            <div className="flex items-center gap-1 flex-1">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder={customInputPlaceholder}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[var(--color-turquoise)]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onCustomInput(customValue);
                }}
              />
              <button
                onClick={() => onCustomInput(customValue)}
                className="btn-primary"
              >
                {t('controls.apply')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step description */}
      {description && <p className="controls-description">{description}</p>}
    </div>
  );
}
