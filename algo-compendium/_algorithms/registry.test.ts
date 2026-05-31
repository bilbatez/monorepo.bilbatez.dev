import { describe, it, expect } from 'vitest';
import {
  registerAlgorithm,
  getAlgorithm,
  getAlgorithmsByCategory,
  getAllAlgorithms,
} from './registry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeMeta(slug: string, category: 'sorting' | 'math' = 'sorting'): any {
  return {
    name: slug,
    slug,
    category,
    description: 'test',
    bestCase: 'O(1)',
    averageCase: 'O(n)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: '',
    visualizerType: 'array',
    defaultInput: {},
    run: () => [],
    reduce: (s: unknown) => s,
  };
}

const SORT_SLUG = '_reg-test-sort-' + Math.random().toString(36).slice(2);
const MATH_SLUG = '_reg-test-math-' + Math.random().toString(36).slice(2);

registerAlgorithm(makeMeta(SORT_SLUG, 'sorting'));
registerAlgorithm(makeMeta(MATH_SLUG, 'math'));

describe('registry', () => {
  it('getAlgorithm returns registered entry', () => {
    const algo = getAlgorithm('sorting', SORT_SLUG);
    expect(algo).toBeDefined();
    expect(algo?.slug).toBe(SORT_SLUG);
    expect(algo?.category).toBe('sorting');
  });

  it('getAlgorithm returns undefined for unknown slug', () => {
    expect(getAlgorithm('sorting', '__nonexistent__')).toBeUndefined();
  });

  it('getAlgorithm returns undefined for wrong category', () => {
    expect(getAlgorithm('graph', SORT_SLUG)).toBeUndefined();
  });

  it('getAlgorithmsByCategory filters by category', () => {
    const sortAlgos = getAlgorithmsByCategory('sorting');
    const slugs = sortAlgos.map((a) => a.slug);
    expect(slugs).toContain(SORT_SLUG);
    expect(slugs).not.toContain(MATH_SLUG);
  });

  it('getAlgorithmsByCategory returns math entry', () => {
    const mathAlgos = getAlgorithmsByCategory('math');
    expect(mathAlgos.map((a) => a.slug)).toContain(MATH_SLUG);
  });

  it('getAllAlgorithms includes both registered entries', () => {
    const all = getAllAlgorithms().map((a) => a.slug);
    expect(all).toContain(SORT_SLUG);
    expect(all).toContain(MATH_SLUG);
  });

  it('overwriting same key replaces entry', () => {
    const updated = {
      ...makeMeta(SORT_SLUG, 'sorting'),
      description: 'updated',
    };
    registerAlgorithm(updated);
    expect(getAlgorithm('sorting', SORT_SLUG)?.description).toBe('updated');
  });
});
