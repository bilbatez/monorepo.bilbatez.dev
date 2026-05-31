import { AlgorithmDetailPage } from '@/algo-compendium/pom/algorithm-detail-page';
import { CategoryListPage } from '@/algo-compendium/pom/category-list-page';
import { test as base } from '@playwright/test';

const test = base.extend<{
  categoryPage: CategoryListPage;
  detailPage: AlgorithmDetailPage;
}>({
  categoryPage: async ({ page }, use) => {
    const p = CategoryListPage.factory(page);
    await p.nav.gotoCategory('string-matching');
    await use(p);
  },
  detailPage: async ({ page }, use) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('string-matching', 'naive-search');
    await use(p);
  },
});

test.describe('String Matching — category list', () => {
  test('shows "String Matching" heading', async ({ categoryPage }) => {
    await categoryPage.hasCategoryHeading('String Matching');
  });

  test('shows 5 algorithm cards', async ({ categoryPage }) => {
    await categoryPage.hasAlgorithmCount(5);
  });
});

test.describe('String Matching — Naive Search detail', () => {
  test('has algorithm name', async ({ detailPage }) => {
    await detailPage.hasAlgorithmName();
  });

  test('has visualizer section', async ({ detailPage }) => {
    await detailPage.hasVisualizerSection();
  });

  test('has play controls', async ({ detailPage }) => {
    await detailPage.hasPlayControls();
  });

  test('can play and pause', async ({ detailPage }) => {
    await detailPage.canPlay();
  });

  test('overview shows complexity info', async ({ detailPage }) => {
    await detailPage.hasComplexityInfo();
  });
});

test.describe('String Matching — KMP Search detail', () => {
  test('has algorithm name and visualizer', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('string-matching', 'kmp-search');
    await p.hasAlgorithmName();
    await p.hasVisualizerSection();
  });
});

test.describe('String Matching — Boyer-Moore Search detail', () => {
  test('has algorithm name and controls', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('string-matching', 'boyer-moore-search');
    await p.hasAlgorithmName();
    await p.hasPlayControls();
  });
});
