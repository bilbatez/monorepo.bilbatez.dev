import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Nav } from './components/nav';

export class HomePage {
  constructor(
    public readonly page: Page,
    public readonly nav: Nav
  ) {}

  async hasTitle() {
    await expect(
      this.page.getByRole('heading', {
        name: /algorithm compendium/i,
        level: 1,
      })
    ).toBeVisible();
  }

  async hasCategoryCards() {
    const cards = this.page
      .locator('main a[href]')
      .filter({ has: this.page.locator('h2') });
    await expect(cards.first()).toBeVisible();
  }

  async hasEightCategoryCards() {
    const cards = this.page
      .locator('main a[href]')
      .filter({ has: this.page.locator('h2') });
    await expect(cards).toHaveCount(8, { timeout: 5000 });
  }

  async hasCategoryCard(name: string) {
    await expect(
      this.page.getByRole('link', { name: new RegExp(name, 'i') }).first()
    ).toBeVisible();
  }

  async navigatesToCategory(category: string) {
    await this.page
      .getByRole('link', { name: new RegExp(category, 'i') })
      .first()
      .click();
    await this.page.waitForURL(`**/${category}`);
  }

  static factory(page: Page): HomePage {
    return new HomePage(page, new Nav(page));
  }
}
