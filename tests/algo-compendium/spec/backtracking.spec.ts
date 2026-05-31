import { AlgorithmDetailPage } from '@/algo-compendium/pom/algorithm-detail-page';
import { CategoryListPage } from '@/algo-compendium/pom/category-list-page';
import { test as base } from '@playwright/test';

const test = base.extend<{
  categoryPage: CategoryListPage;
  detailPage: AlgorithmDetailPage;
}>({
  categoryPage: async ({ page }, use) => {
    const p = CategoryListPage.factory(page);
    await p.nav.gotoCategory('backtracking');
    await use(p);
  },
  detailPage: async ({ page }, use) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('backtracking', 'n-queens');
    await use(p);
  },
});

test.describe('Backtracking — category list', () => {
  test('shows "Backtracking" heading', async ({ categoryPage }) => {
    await categoryPage.hasCategoryHeading('Backtracking');
  });

  test('shows 5 algorithm cards', async ({ categoryPage }) => {
    await categoryPage.hasAlgorithmCount(5);
  });
});

test.describe('Backtracking — N-Queens detail', () => {
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

test.describe('Backtracking — Permutations detail', () => {
  test('has algorithm name and visualizer', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('backtracking', 'permutations');
    await p.hasAlgorithmName();
    await p.hasVisualizerSection();
  });
});

test.describe('Backtracking — Sudoku Solver detail', () => {
  test('has algorithm name and controls', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('backtracking', 'sudoku-solver');
    await p.hasAlgorithmName();
    await p.hasPlayControls();
  });
});
