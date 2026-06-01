import type { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://127.0.0.1:3004/');
  }

  get playButton() {
    return this.page.getByRole('button', { name: /play|continue/i });
  }

  get levelSelectButton() {
    return this.page.getByRole('button', { name: /level select/i });
  }

  get title() {
    return this.page.getByRole('heading', { name: 'again' });
  }
}
