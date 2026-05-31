import { AlgorithmDetailPage } from '@/algo-compendium/pom/algorithm-detail-page';
import { CategoryListPage } from '@/algo-compendium/pom/category-list-page';
import { test as base } from '@playwright/test';

const test = base.extend<{
  categoryPage: CategoryListPage;
  detailPage: AlgorithmDetailPage;
}>({
  categoryPage: async ({ page }, use) => {
    const p = CategoryListPage.factory(page);
    await p.nav.gotoCategory('sorting');
    await use(p);
  },
  detailPage: async ({ page }, use) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('sorting', 'bubble-sort');
    await use(p);
  },
});

test.describe('Sorting — category list', () => {
  test('shows "Sorting" heading', async ({ categoryPage }) => {
    await categoryPage.hasCategoryHeading('Sorting');
  });

  test('shows 13 algorithm cards', async ({ categoryPage }) => {
    await categoryPage.hasAlgorithmCount(13);
  });

  test('navigates to merge sort detail', async ({ categoryPage }) => {
    await categoryPage.navigatesToAlgorithm('merge-sort');
  });
});

test.describe('Sorting — Bubble Sort detail', () => {
  test('has algorithm name heading', async ({ detailPage }) => {
    await detailPage.hasAlgorithmName();
  });

  test('has category badge', async ({ detailPage }) => {
    await detailPage.categoryBadgeIsVisible();
  });

  test('has visualizer section', async ({ detailPage }) => {
    await detailPage.hasVisualizerSection();
  });

  test('has play controls', async ({ detailPage }) => {
    await detailPage.hasPlayControls();
  });

  test('can play and pause visualizer', async ({ detailPage }) => {
    await detailPage.canPlay();
  });

  test('can step forward', async ({ detailPage }) => {
    await detailPage.canStepForward();
  });

  test('overview toggle shows complexity and pseudocode', async ({
    detailPage,
  }) => {
    await detailPage.hasComplexityInfo();
    await detailPage.hasPseudocode();
  });

  test('overview collapses and expands', async ({ detailPage }) => {
    await detailPage.overviewToggles();
  });
});

test.describe('Sorting — Quick Sort detail', () => {
  test('has algorithm name', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('sorting', 'quick-sort');
    await p.hasAlgorithmName();
    await p.hasVisualizerSection();
  });
});

test.describe('Sorting — Merge Sort detail', () => {
  test('has visualizer and controls', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('sorting', 'merge-sort');
    await p.hasAlgorithmName();
    await p.hasPlayControls();
  });
});
