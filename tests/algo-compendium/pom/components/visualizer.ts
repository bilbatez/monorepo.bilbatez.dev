import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Visualizer {
  constructor(public readonly page: Page) {}

  async isVisible() {
    const visualizerArea = this.page
      .locator('[data-testid="visualizer"]')
      .or(this.page.locator('svg, .visualizer, [class*="Visualizer"]'));
    await expect(visualizerArea.first())
      .toBeVisible({ timeout: 5000 })
      .catch(async () => {
        await expect(
          this.page.getByRole('button', { name: /play|pause/i }).first()
        ).toBeVisible();
      });
  }

  async hasControls() {
    await expect(
      this.page
        .getByRole('button')
        .filter({ hasText: /play|pause|▶|⏸/i })
        .first()
    ).toBeVisible();
  }

  playButtonLocator() {
    return this.page.getByRole('button').filter({ hasText: /play/i }).first();
  }
}
