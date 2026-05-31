import { useState, useMemo, useEffect, useCallback, useRef } from 'react';

export type PlayerState<S> = {
  currentState: S;
  index: number;
  totalCommands: number;
  isPlaying: boolean;
  speed: number;
  stepForward: () => void;
  stepBack: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  jumpTo: (index: number) => void;
};

export function useAlgorithmPlayer<C, S>(
  initialState: S,
  commands: C[],
  reduce: (state: S, cmd: C) => S
): PlayerState<S> {
  const [index, setIndex] = useState(-1); // -1 = initial state, no commands applied
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Compute current state by replaying commands 0..index onto initialState
  const currentState = useMemo(
    () =>
      commands.slice(0, Math.max(0, index + 1)).reduce(reduce, initialState),
    [initialState, commands, reduce, index]
  );

  const stepForward = useCallback(() => {
    setIndex((i) => Math.min(i + 1, commands.length - 1));
  }, [commands.length]);

  const stepBack = useCallback(() => {
    setIndex((i) => Math.max(i - 1, -1));
  }, []);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIndex(-1);
  }, []);

  const setSpeed = useCallback((s: number) => setSpeedState(s), []);

  const jumpTo = useCallback(
    (i: number) => setIndex(Math.max(-1, Math.min(i, commands.length - 1))),
    [commands.length]
  );

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const delay = Math.round(600 / speed);
    intervalRef.current = setInterval(() => {
      setIndex((i) => {
        if (i >= commands.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, delay);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, commands.length]);

  // Reset when commands change (new input)
  useEffect(() => {
    setIndex(-1);
    setIsPlaying(false);
  }, [commands]);

  return {
    currentState,
    index,
    totalCommands: commands.length,
    isPlaying,
    speed,
    stepForward,
    stepBack,
    play,
    pause,
    reset,
    setSpeed,
    jumpTo,
  };
}
