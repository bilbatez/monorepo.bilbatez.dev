import { AlgorithmDetailPage } from '@/algo-compendium/pom/algorithm-detail-page';
import { CategoryListPage } from '@/algo-compendium/pom/category-list-page';
import { test as base } from '@playwright/test';

const test = base.extend<{
  categoryPage: CategoryListPage;
  detailPage: AlgorithmDetailPage;
}>({
  categoryPage: async ({ page }, use) => {
    const p = CategoryListPage.factory(page);
    await p.nav.gotoCategory('tree');
    await use(p);
  },
  detailPage: async ({ page }, use) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('tree', 'inorder-traversal');
    await use(p);
  },
});

test.describe('Tree — category list', () => {
  test('shows "Tree" heading', async ({ categoryPage }) => {
    await categoryPage.hasCategoryHeading('Tree');
  });

  test('shows 8 algorithm cards', async ({ categoryPage }) => {
    await categoryPage.hasAlgorithmCount(8);
  });
});

test.describe('Tree — Inorder Traversal detail', () => {
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

test.describe('Tree — BST Insert detail', () => {
  test('has algorithm name and visualizer', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('tree', 'bst-insert');
    await p.hasAlgorithmName();
    await p.hasVisualizerSection();
  });
});

test.describe('Tree — Level Order Traversal detail', () => {
  test('has algorithm name and controls', async ({ page }) => {
    const p = AlgorithmDetailPage.factory(page);
    await p.nav.gotoAlgorithm('tree', 'level-order-traversal');
    await p.hasAlgorithmName();
    await p.hasPlayControls();
  });
});
