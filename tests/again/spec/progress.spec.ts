import { test, expect } from '@playwright/test';

test.describe('Level select progress', () => {
  test('shows levels 1 and 2 when level 1 passed', async ({ page }) => {
    await page.context().clearCookies();
    await page.context().addCookies([
      {
        name: 'again_progress',
        value: encodeURIComponent(JSON.stringify({ maxLevelPassed: 1 })),
        url: 'http://127.0.0.1:3004',
      },
    ]);
    await page.goto('http://127.0.0.1:3004/levels');
    // Level 1 and 2 should be enabled buttons (unlocked = [1, 2] when maxLevelPassed = 1).
    // Match by level name — number prefixes collide (/^1/ also matches level 10).
    const level1 = page.getByRole('button', { name: 'First Steps' });
    const level2 = page.getByRole('button', { name: 'Moving On' });
    await expect(level1).toBeEnabled();
    await expect(level2).toBeEnabled();
  });

  test('level 4 is locked when only levels 1-2 passed', async ({ page }) => {
    await page.context().clearCookies();
    await page.context().addCookies([
      {
        name: 'again_progress',
        value: encodeURIComponent(JSON.stringify({ maxLevelPassed: 2 })),
        url: 'http://127.0.0.1:3004',
      },
    ]);
    await page.goto('http://127.0.0.1:3004/levels');
    // unlocked = [1, 2, 3] when maxLevelPassed = 2; level 4 is still locked
    const level4 = page.getByRole('button', { name: 'Bridge Builder' });
    await expect(level4).toBeDisabled();
  });
});
