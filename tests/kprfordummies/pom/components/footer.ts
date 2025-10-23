import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Footer {
  constructor(public readonly page: Page) {}

  async hasValidFooter() {
    const footer = this.page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/^Dibuat olehBilbatez.dev/);
  }
}
