import { AlgorithmDetailPage } from '@/algo-compendium/pom/algorithm-detail-page';
import { CategoryListPage } from '@/algo-compendium/pom/category-list-page';
import { test as base } from '@playwright/test';

const test = base.extend<{
  categoryPage: CategoryListPage;
  detailPage: AlgorithmDetailPage;
}>({
  categoryPage: async ({ page }, use) => {
    const p = CategoryListPage.factory(page);
    await p.nav.gotoCategory('dynamic-programming');
    await use(p);
  },
  detailPage: async ({ page }, use) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('dynamic-programming', 'fibonacci');
    await use(p);
  },
});

test.describe('Dynamic Programming — category list', () => {
  test('shows "Dynamic Programming" heading', async ({ categoryPage }) => {
    await categoryPage.hasCategoryHeading('Dynamic Programming');
  });

  test('shows 8 algorithm cards', async ({ categoryPage }) => {
    await categoryPage.hasAlgorithmCount(8);
  });
});

test.describe('Dynamic Programming — Fibonacci detail', () => {
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

test.describe('Dynamic Programming — LCS detail', () => {
  test('has algorithm name and visualizer', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('dynamic-programming', 'lcs');
    await p.hasAlgorithmName();
    await p.hasVisualizerSection();
  });
});

test.describe('Dynamic Programming — Knapsack detail', () => {
  test('has algorithm name and controls', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('dynamic-programming', 'knapsack');
    await p.hasAlgorithmName();
    await p.hasPlayControls();
  });
});
