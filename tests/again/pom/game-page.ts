import type { Page } from '@playwright/test';

export class GamePage {
  constructor(private page: Page) {}

  async goto(levelId = 1) {
    await this.page.goto(`http://127.0.0.1:3004/play/${levelId}`);
  }

  get canvas() {
    return this.page.locator('canvas');
  }

  get hudHomeButton() {
    return this.page.getByRole('button', { name: /home/i });
  }

  get smallScreenOverlay() {
    return this.page.getByText(/screen too small/i);
  }

  get winPopup() {
    return this.page.getByText(/level complete|you beat the game/i);
  }
}
