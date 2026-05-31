import { AlgorithmDetailPage } from '@/algo-compendium/pom/algorithm-detail-page';
import { CategoryListPage } from '@/algo-compendium/pom/category-list-page';
import { test as base } from '@playwright/test';

const test = base.extend<{
  categoryPage: CategoryListPage;
  detailPage: AlgorithmDetailPage;
}>({
  categoryPage: async ({ page }, use) => {
    const p = CategoryListPage.factory(page);
    await p.nav.gotoCategory('graph');
    await use(p);
  },
  detailPage: async ({ page }, use) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('graph', 'bfs');
    await use(p);
  },
});

test.describe('Graph — category list', () => {
  test('shows "Graph" heading', async ({ categoryPage }) => {
    await categoryPage.hasCategoryHeading('Graph');
  });

  test('shows 10 algorithm cards', async ({ categoryPage }) => {
    await categoryPage.hasAlgorithmCount(10);
  });
});

test.describe('Graph — BFS detail', () => {
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

test.describe('Graph — DFS detail', () => {
  test('has algorithm name and visualizer', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('graph', 'dfs');
    await p.hasAlgorithmName();
    await p.hasVisualizerSection();
  });
});

test.describe('Graph — Dijkstra detail', () => {
  test('has algorithm name and controls', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('graph', 'dijkstra');
    await p.hasAlgorithmName();
    await p.hasPlayControls();
  });
});
