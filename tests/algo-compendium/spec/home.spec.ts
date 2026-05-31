import { HomePage } from '@/algo-compendium/pom/home-page';
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    const homePage = HomePage.factory(page);
    await homePage.nav.gotoWebsite();
    await use(homePage);
  },
});

test.describe('Algorithm Compendium — Home', () => {
  test('has "Algorithm Compendium" heading', async ({ homePage }) => {
    await homePage.hasTitle();
  });

  test('shows exactly 8 category cards', async ({ homePage }) => {
    await homePage.hasEightCategoryCards();
  });

  test('shows all 8 categories', async ({ homePage }) => {
    for (const name of [
      'Sorting',
      'Searching',
      'Graph',
      'Tree',
      'Dynamic Programming',
      'String Matching',
      'Backtracking',
      'Mathematics',
    ]) {
      await homePage.hasCategoryCard(name);
    }
  });

  test('sidebar is visible', async ({ homePage }) => {
    await homePage.nav.sidebarIsVisible();
  });

  test('sidebar title links to home', async ({ page }) => {
    const homePage = HomePage.factory(page);
    await homePage.nav.gotoCategory('sorting');
    await homePage.nav.sidebarTitleNavigatesHome();
  });

  test('navigates to sorting category on card click', async ({ homePage }) => {
    await homePage.navigatesToCategory('sorting');
  });

  test('navigates to graph category on card click', async ({ homePage }) => {
    await homePage.navigatesToCategory('graph');
  });
});

test.describe('Algorithm Compendium — Sidebar', () => {
  test('sidebar collapse/expand works', async ({ page }) => {
    const homePage = HomePage.factory(page);
    await homePage.nav.gotoWebsite();
    await homePage.nav.canCollapseAndExpandSidebar();
  });

  test('sidebar has algorithm compendium title', async ({ page }) => {
    await page.goto('http://localhost:3003');
    await expect(page.getByText('Algorithm Compendium').first()).toBeVisible();
  });
});
