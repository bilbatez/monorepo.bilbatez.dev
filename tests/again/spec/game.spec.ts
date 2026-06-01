import { test, expect } from '@playwright/test';
import { GamePage } from '../pom/game-page';

test.describe('Game screen', () => {
  test('shows canvas on /play/1', async ({ page }) => {
    const game = new GamePage(page);
    await game.goto(1);
    await expect(game.canvas).toBeVisible();
  });

  test('shows HUD home button', async ({ page }) => {
    const game = new GamePage(page);
    await game.goto(1);
    await expect(game.hudHomeButton).toBeVisible();
  });

  test('Home button navigates back to /', async ({ page }) => {
    const game = new GamePage(page);
    await game.goto(1);
    await game.hudHomeButton.click();
    await expect(page).toHaveURL('http://127.0.0.1:3004/');
  });

  test('shows small screen overlay on narrow viewport', async ({ browser }) => {
    // MIN_SCREEN_PX = 1024; use 800px to trigger the overlay
    const context = await browser.newContext({
      viewport: { width: 800, height: 600 },
    });
    const page = await context.newPage();
    const game = new GamePage(page);
    await game.goto(1);
    await expect(game.smallScreenOverlay).toBeVisible();
    await context.close();
  });

  test('does not show small screen overlay on wide viewport', async ({
    browser,
  }) => {
    // MIN_SCREEN_PX = 1024; use 1280px to stay above threshold
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();
    const game = new GamePage(page);
    await game.goto(1);
    await expect(game.smallScreenOverlay).not.toBeVisible();
    await context.close();
  });
});
