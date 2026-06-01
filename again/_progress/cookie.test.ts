import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock document.cookie with a simple in-memory store
let cookieStore = '';
vi.stubGlobal('document', {
  get cookie() {
    return cookieStore;
  },
  set cookie(val: string) {
    // parse and store (simplified)
    const [pair] = val.split(';');
    const [key, value] = pair.split('=');
    const existing = cookieStore
      .split(';')
      .filter((s) => !s.trim().startsWith(`${key.trim()}=`));
    cookieStore = [
      ...existing.filter(Boolean),
      `${key.trim()}=${value?.trim() ?? ''}`,
    ].join('; ');
  },
});

import { getProgress, setPassed, unlockedLevels } from './cookie';

beforeEach(() => {
  cookieStore = '';
});

describe('getProgress', () => {
  it('returns 0 when no cookie', () => {
    expect(getProgress().maxLevelPassed).toBe(0);
  });
});

describe('setPassed', () => {
  it('updates maxLevelPassed', () => {
    setPassed(3);
    expect(getProgress().maxLevelPassed).toBe(3);
  });

  it('does not lower maxLevelPassed', () => {
    setPassed(5);
    setPassed(2);
    expect(getProgress().maxLevelPassed).toBe(5);
  });
});

describe('unlockedLevels', () => {
  it('returns [1] when nothing passed', () => {
    expect(unlockedLevels(10)).toEqual([1]);
  });

  it('returns 1..passed+1 when levels passed', () => {
    setPassed(3);
    expect(unlockedLevels(10)).toEqual([1, 2, 3, 4]);
  });

  it('caps at totalLevels', () => {
    setPassed(10);
    expect(unlockedLevels(10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
