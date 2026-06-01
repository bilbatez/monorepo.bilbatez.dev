import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/home-page';

test.describe('Home screen', () => {
  test('shows title and Play button', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.title).toBeVisible();
    await expect(home.playButton).toBeVisible();
  });

  test('hides Level Select when no progress', async ({ page }) => {
    // Clear any cookies from prior tests
    await page.context().clearCookies();
    const home = new HomePage(page);
    await home.goto();
    await expect(home.levelSelectButton).not.toBeVisible();
  });

  test('shows Level Select when level 1 passed', async ({ page }) => {
    await page.context().clearCookies();
    // Set the progress cookie — value must be URL-encoded to match cookie.ts setCookie()
    await page.context().addCookies([
      {
        name: 'again_progress',
        value: encodeURIComponent(JSON.stringify({ maxLevelPassed: 1 })),
        url: 'http://127.0.0.1:3004',
      },
    ]);
    const home = new HomePage(page);
    await home.goto();
    await expect(home.levelSelectButton).toBeVisible();
  });

  test('Play button navigates to /play/1 when no progress', async ({
    page,
  }) => {
    await page.context().clearCookies();
    const home = new HomePage(page);
    await home.goto();
    await home.playButton.click();
    await expect(page).toHaveURL(/\/play\/1/);
  });
});
