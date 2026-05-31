/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AlgorithmMeta, AlgorithmCategory } from './_shared/types';

const registry = new Map<string, AlgorithmMeta<any, any>>();

export function registerAlgorithm(meta: AlgorithmMeta<any, any>): void {
  registry.set(`${meta.category}/${meta.slug}`, meta);
}

export function getAlgorithm(
  category: AlgorithmCategory,
  slug: string
): AlgorithmMeta<any, any> | undefined {
  return registry.get(`${category}/${slug}`);
}

export function getAlgorithmsByCategory(
  category: AlgorithmCategory
): AlgorithmMeta<any, any>[] {
  return [...registry.values()].filter((m) => m.category === category);
}

export function getAllAlgorithms(): AlgorithmMeta<any, any>[] {
  return [...registry.values()];
}
