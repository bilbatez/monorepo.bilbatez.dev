export type StringCommand =
  | {
      type: 'compare';
      textIndex: number;
      patternIndex: number;
      description: string;
    }
  | {
      type: 'match_char';
      textIndex: number;
      patternIndex: number;
      description: string;
    }
  | {
      type: 'mismatch';
      textIndex: number;
      patternIndex: number;
      description: string;
    }
  | { type: 'shift'; newOffset: number; description: string }
  | { type: 'found'; at: number; description: string }
  | {
      type: 'update_hash';
      textHash: number;
      patternHash: number;
      description: string;
    }
  | {
      type: 'update_failure';
      index: number;
      value: number;
      description: string;
    };

export type StringState = {
  text: string;
  pattern: string;
  offset: number; // current alignment of pattern in text
  matchedChars: number[]; // text indices that matched
  mismatchedChars: number[]; // text indices that mismatched
  foundAt: number[]; // all occurrences found
  currentTextIndex: number | null;
  currentPatternIndex: number | null;
  failureTable: number[]; // KMP failure table
  textHash: number | null; // Rabin-Karp
  patternHash: number | null; // Rabin-Karp
  description: string;
};

export function makeStringState(text: string, pattern: string): StringState {
  return {
    text,
    pattern,
    offset: 0,
    matchedChars: [],
    mismatchedChars: [],
    foundAt: [],
    currentTextIndex: null,
    currentPatternIndex: null,
    failureTable: [],
    textHash: null,
    patternHash: null,
    description: `Searching for "${pattern}" in "${text}"`,
  };
}

export function stringReducer(
  state: StringState,
  cmd: StringCommand
): StringState {
  switch (cmd.type) {
    case 'compare':
      return {
        ...state,
        currentTextIndex: cmd.textIndex,
        currentPatternIndex: cmd.patternIndex,
        description: cmd.description,
      };
    case 'match_char':
      return {
        ...state,
        matchedChars: [...state.matchedChars, cmd.textIndex],
        currentTextIndex: cmd.textIndex,
        description: cmd.description,
      };
    case 'mismatch':
      return {
        ...state,
        mismatchedChars: [
          ...new Set([...state.mismatchedChars, cmd.textIndex]),
        ],
        currentTextIndex: cmd.textIndex,
        description: cmd.description,
      };
    case 'shift':
      return {
        ...state,
        offset: cmd.newOffset,
        matchedChars: [],
        mismatchedChars: [],
        description: cmd.description,
      };
    case 'found':
      return {
        ...state,
        foundAt: [...state.foundAt, cmd.at],
        description: cmd.description,
      };
    case 'update_hash':
      return {
        ...state,
        textHash: cmd.textHash,
        patternHash: cmd.patternHash,
        description: cmd.description,
      };
    case 'update_failure': {
      const failureTable = [...state.failureTable];
      failureTable[cmd.index] = cmd.value;
      return { ...state, failureTable, description: cmd.description };
    }
  }
}
