import { AlgorithmDetailPage } from '@/algo-compendium/pom/algorithm-detail-page';
import { CategoryListPage } from '@/algo-compendium/pom/category-list-page';
import { test as base } from '@playwright/test';

const test = base.extend<{
  categoryPage: CategoryListPage;
  detailPage: AlgorithmDetailPage;
}>({
  categoryPage: async ({ page }, use) => {
    const p = CategoryListPage.factory(page);
    await p.nav.gotoCategory('math');
    await use(p);
  },
  detailPage: async ({ page }, use) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('math', 'sieve-of-eratosthenes');
    await use(p);
  },
});

test.describe('Math — category list', () => {
  test('shows "Mathematics" heading', async ({ categoryPage }) => {
    await categoryPage.hasCategoryHeading('Mathematics');
  });

  test('shows 7 algorithm cards', async ({ categoryPage }) => {
    await categoryPage.hasAlgorithmCount(7);
  });
});

test.describe('Math — Sieve of Eratosthenes detail', () => {
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

test.describe('Math — Euclidean GCD detail', () => {
  test('has algorithm name and visualizer', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('math', 'euclidean-gcd');
    await p.hasAlgorithmName();
    await p.hasVisualizerSection();
  });
});

test.describe('Math — Fast Power detail', () => {
  test('has algorithm name and controls', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('math', 'fast-power');
    await p.hasAlgorithmName();
    await p.hasPlayControls();
  });
});
